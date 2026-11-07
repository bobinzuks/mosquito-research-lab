import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ledger=JSON.parse(readFileSync(new URL('../research/mosquito/evidence-ledger.json',import.meta.url)));
test('ledger contains unique IDs and traceable sources',()=>{
 assert.ok(ledger.records.length>=5);
 assert.equal(new Set(ledger.records.map(x=>x.id)).size,ledger.records.length);
 for(const r of ledger.records){
  assert.ok(r.claim && r.species && r.method && r.limitations);
  assert.match(r.source.url,/^https:\/\//);
  assert.ok(['source-inspected','independently-replicated','unverified'].includes(r.reviewStatus));
 }
});
test('source inspection is not misrepresented as independent replication',()=>{
 assert.ok(ledger.records.every(r=>r.reviewStatus!=='independently-replicated'));
});
