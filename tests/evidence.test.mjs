import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateClaim,compareStrategies} from '../packages/research-scientist/evidence.mjs';
test('unverified claims remain unverified',()=>assert.equal(evaluateClaim({text:'x',sources:[]}).status,'unverified'));
test('reviewed observations are labeled',()=>assert.equal(evaluateClaim({text:'x',sources:[{id:'paper-1',kind:'observation',reviewed:true}]}).evidenceCount,1));
test('candidate improvement is measured',()=>assert.equal(compareStrategies({correct:4,total:10},{correct:6,total:10}).improved,true));
test('invalid scores rejected',()=>assert.throws(()=>compareStrategies({correct:11,total:10},{correct:5,total:10})));
