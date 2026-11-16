import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const units=JSON.parse(fs.readFileSync(path.join(root,'assets/data/units.json'),'utf8'));
const errors=[], ids=new Set(), prompts=new Map();
if(units.length!==74) errors.push(`expected 74 units, got ${units.length}`);
for(const u of units){
 if(ids.has(u.id)) errors.push(`duplicate ${u.id}`); ids.add(u.id);
 for(const key of ['id','title','goal','know','worksheet']) if(!u[key]) errors.push(`${u.id}: missing ${key}`);
 if(!fs.existsSync(path.join(root,u.worksheet))) errors.push(`${u.id}: missing worksheet`);
 if(!u.basis?.length||!u.extension?.length) errors.push(`${u.id}: task lists incomplete`);
 if(u.external){try {if(new URL(u.external.url).protocol!=='https:') throw Error();} catch {errors.push(`${u.id}: invalid external URL`)} if(!u.external.label) errors.push(`${u.id}: missing link label`)}
 if(!Array.isArray(u.questions)||u.questions.length!==5){errors.push(`${u.id}: exactly five questions required`);continue}
 for(const q of u.questions){
  if(!q.prompt||!q.correct||!q.why||!Array.isArray(q.distractors)||q.distractors.length!==3) {errors.push(`${u.id}: incomplete question`);continue}
  if(new Set([q.correct,...q.distractors]).size!==4) errors.push(`${u.id}: duplicate answers in ${q.prompt}`);
  if(prompts.has(q.prompt)) errors.push(`${u.id}: duplicate question from ${prompts.get(q.prompt)}: ${q.prompt}`); else prompts.set(q.prompt,u.id);
 }
}
console.log(`Units: ${units.length}; unique questions: ${prompts.size}; worksheets: ${units.filter(u=>fs.existsSync(path.join(root,u.worksheet))).length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Project validation OK.');
