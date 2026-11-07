import {rank,chooseOnTraining} from '../packages/research-scientist/strategy.mjs';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('./synthetic-questions.json',import.meta.url)));
const score=(questions,strategy)=>({correct:questions.filter(q=>rank(q,data.sources,strategy)[0]?.id===q.expected).length,total:questions.length});
const chosen=chooseOnTraining(Object.assign([...data.train],{sources:data.sources}));
const baseline=score(data.holdout,'keyword'), candidate=score(data.holdout,chosen);
const report={synthetic:true,disclaimer:'This is strategy selection, NOT autonomous RSI or validated mosquito neuroscience.',baselineStrategy:'keyword',selectedStrategy:chosen,baseline,candidate,improved:candidate.correct>baseline.correct};
mkdirSync('reports',{recursive:true});writeFileSync('reports/latest.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
