import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const units = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/units.json'), 'utf8'));
const errors = [];
const ids = new Set();

if (units.length !== 74) errors.push(`expected 74 units, got ${units.length}`);

for (const unit of units) {
  if (ids.has(unit.id)) errors.push(`duplicate ${unit.id}`);
  ids.add(unit.id);
  for (const key of ['id', 'title', 'goal', 'know', 'worksheet', 'external', 'video']) {
    if (!unit[key]) errors.push(`${unit.id}: missing ${key}`);
  }
  if (!fs.existsSync(path.join(root, unit.worksheet))) {
    errors.push(`${unit.id}: missing worksheet ${unit.worksheet}`);
  }
  if (!unit.basis?.length || !unit.extension?.length) {
    errors.push(`${unit.id}: task lists incomplete`);
  }
}

console.log(`Units: ${units.length}`);
console.log(`Worksheets: ${units.filter(unit => fs.existsSync(path.join(root, unit.worksheet))).length}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Project validation OK.');
