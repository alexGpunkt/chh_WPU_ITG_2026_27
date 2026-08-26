
'use strict';
const ITGTracker=(()=>{
 const C=Object.assign({enabled:false,heartbeatSeconds:20,classCode:'WPU-ITG',appName:'chh_wpu_itg'},window.ITG_SUPABASE||{});
 const QKEY='itg.tracker.queue.v1',CKEY='itg.client_id',SKEY='itg.session_id';let queue=read(QKEY,[]),sending=false,ctx={page:(location.pathname.split('/').pop()||'index.html').replace('.html',''),unit:null,path:null,task:null,phase:null,progress:0},last=Date.now();
 function uuid(){return crypto?.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)})}
 function read(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
 function id(k,session=false){const s=session?sessionStorage:localStorage;let v=s.getItem(k);if(!v){v=uuid();s.setItem(k,v)}return v}
 function student(){return ITGLogin.saved()}
 function configured(){return !!(C.enabled&&C.url&&C.anonKey)}
 function base(){return String(C.url).replace(/\/$/,'')+'/rest/v1/'}function headers(prefer='return=minimal'){const h={'Content-Type':'application/json',apikey:String(C.anonKey||''),Prefer:prefer};if(C.anonKey&&!String(C.anonKey).startsWith('sb_publishable_'))h.Authorization='Bearer '+C.anonKey;return h}
 function common(){const s=student()||{};return{app_name:C.appName,student_id:s.student_id||null,student:s.display_name||s.login_name||'anonym',client_id:id(CKEY),session_id:id(SKEY,true),class_code:s.class_code||C.classCode||null,page:ctx.page,unit:ctx.unit,path:ctx.path,task:ctx.task,phase:ctx.phase,ts:new Date().toISOString()}}
 function track(type,payload={}){const e={event_type:type,...common(),payload};if(!configured()){console.debug('[ITG tracker]',e);return}if(!e.student_id)return;queue.push(e);queue=queue.slice(-500);write(QKEY,queue);setTimeout(flush,type==='answer'||type==='final_test'?200:900)}
 async function flush(){if(!configured()||sending||!queue.length||!navigator.onLine)return;sending=true;const batch=queue.slice(0,50);try{const r=await fetch(base()+'rpc/itg_events_melden',{method:'POST',headers:headers(),body:JSON.stringify({p_events:batch}),keepalive:true});if(!r.ok)throw new Error(await r.text());queue.splice(0,batch.length);write(QKEY,queue);if(queue.length)setTimeout(flush,250)}catch(e){console.warn('[ITG tracker]',e.message)}finally{sending=false}}
 async function progress(snap={}){ctx={...ctx,...snap};const s=student();if(!configured()||!s?.student_id)return;const row={...common(),current_task:snap.task??ctx.task,completed_steps:Number(snap.completed||0),total_steps:Number(snap.total||7),progress_percent:Math.max(0,Math.min(100,Number(snap.percent||0))),correct_count:Number(snap.correct||0),attempts_count:Number(snap.attempts||0),status:snap.status==='completed'?'completed':'active'};delete row.task;try{const r=await fetch(base()+'rpc/itg_progress_speichern',{method:'POST',headers:headers(),body:JSON.stringify({p_progress:row}),keepalive:true});if(!r.ok)throw new Error(await r.text())}catch(e){console.warn('[ITG progress]',e.message)}}
 function setContext(o={}){ctx={...ctx,...o}}
 function start(){['pointerdown','keydown','input','touchstart'].forEach(t=>addEventListener(t,()=>last=Date.now(),{passive:true}));addEventListener('online',flush);addEventListener('pagehide',()=>{track('session_end');flush()});track('session_start',{referrer:document.referrer||null});setInterval(()=>{if(document.visibilityState==='visible')track('heartbeat',{idle_seconds:Math.round((Date.now()-last)/1000),progress:ctx.progress})},Math.max(10,Number(C.heartbeatSeconds)||20)*1000);flush()}
 return{track,progress,setContext,start,flush,common};
})();
window.Tracker=ITGTracker;document.addEventListener('DOMContentLoaded',()=>{(window.ITG_STUDENT_READY||Promise.resolve()).then(()=>ITGTracker.start()).catch(console.warn)},{once:true});
