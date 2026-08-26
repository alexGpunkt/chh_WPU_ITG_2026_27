
'use strict';
const ITGLogin=(()=>{
  const C=window.ITG_SUPABASE||{}; const KEY='itg.student';
  function saved(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
  function store(v){localStorage.setItem(KEY,JSON.stringify(v));return v}
  function norm(v){return String(v||'').trim().toLocaleLowerCase('de-DE').replace(/\s+/g,'')}
  function base(){return String(C.url||'').trim().replace(/\/+$/,'')+'/rest/v1/'}
  function headers(){const h={'Content-Type':'application/json',apikey:String(C.anonKey||'')};if(C.anonKey&&!String(C.anonKey).startsWith('sb_publishable_'))h.Authorization='Bearer '+C.anonKey;return h}
  async function remote(login,classCode){const r=await fetch(base()+'rpc/itg_student_login',{method:'POST',headers:headers(),body:JSON.stringify({p_login:login,p_class:classCode||null})});if(!r.ok)throw new Error((await r.text())||'Anmeldung fehlgeschlagen');const rows=await r.json();if(!rows?.length)throw new Error('Benutzername nicht freigeschaltet.');return rows[0]}
  function overlay(resolve,reject){
    const old=document.querySelector('.loginOverlay');if(old)old.remove();
    const el=document.createElement('div');el.className='loginOverlay';el.innerHTML=`<form class="loginCard"><p class="eyebrow">WPU ITG</p><h2>Schüler-Anmeldung</h2><p>Die Anmeldung ordnet Lernfortschritt eindeutig zu. Im lokalen Testmodus genügt ein Anzeigename.</p><label>Benutzername / Name</label><input name="login" placeholder="nachname.vorname" required autocomplete="username"><label>Klasse / Kurs</label><input name="classCode" value="${C.classCode||'WPU-ITG'}" required><p class="loginError" hidden></p><button class="primary" type="submit">Starten</button></form>`;document.body.append(el);
    el.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.currentTarget),login=norm(f.get('login')),cls=String(f.get('classCode')||'').trim(),err=el.querySelector('.loginError');err.hidden=true;try{let s;if(C.enabled&&C.url&&C.anonKey){s=await remote(login,cls)}else{s={student_id:'local-'+login,login_name:login,display_name:String(f.get('login')).trim(),class_code:cls,local_mode:true}}store(s);el.remove();resolve(s)}catch(x){err.textContent=x.message;err.hidden=false}})
  }
  function ensure(){const s=saved();if(s?.student_id)return Promise.resolve(s);return new Promise(overlay)}
  function logout(){localStorage.removeItem(KEY);location.reload()}
  return {ensure,saved,logout};
})();
window.ITG_STUDENT_READY=ITGLogin.ensure();
