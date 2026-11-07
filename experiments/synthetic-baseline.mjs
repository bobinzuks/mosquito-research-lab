import { evaluateClaim, compareStrategies } from '../packages/research-scientist/evidence.mjs';
const claim = evaluateClaim({text:'Synthetic example only',sources:[]});
const result = compareStrategies({correct:5,total:10},{correct:6,total:10});
console.log(JSON.stringify({synthetic:true,claim,result},null,2));
