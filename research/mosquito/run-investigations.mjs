import { readFileSync } from 'node:fs';
import { investigate } from '../../packages/research-scientist/investigation.mjs';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const { records } = read('./evidence-ledger.json');
const investigations = read('./investigations.json');
const reports = investigations.map(input => investigate({ ...input, evidence: records }));
console.log(JSON.stringify(reports, null, 2));
