import test from 'node:test';import assert from 'node:assert/strict';import {rank,chooseOnTraining} from '../packages/research-scientist/strategy.mjs';
test('stable ranking',()=>assert.deepEqual(rank({terms:['wind']},[{id:'b',title:'wind',abstract:''},{id:'a',title:'wind',abstract:''}]).map(x=>x.id),['a','b']));
test('rejects unknown strategy',()=>assert.throws(()=>rank({terms:[]},[],'magic')));
test('training selects known strategy',()=>{const t=Object.assign([{terms:['heat'],expected:'a'}],{sources:[{id:'a',title:'none',abstract:'heat',reviewed:false},{id:'b',title:'other',abstract:'',reviewed:false}]});assert.ok(['coverage','evidence'].includes(chooseOnTraining(t)))});
