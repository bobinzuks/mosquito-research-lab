// Domain-neutral, deterministic research strategy benchmark.
// Training feedback can update a strategy; held-out questions remain untouched.
export const strategies = Object.freeze({
  keyword: {name:'keyword', score:(q,s)=> q.terms.filter(t=>s.title.toLowerCase().includes(t)).length},
  coverage: {name:'coverage', score:(q,s)=> q.terms.filter(t=>(s.title+' '+s.abstract).toLowerCase().includes(t)).length},
  evidence: {name:'evidence', score:(q,s)=> q.terms.filter(t=>(s.title+' '+s.abstract).toLowerCase().includes(t)).length + (s.reviewed?1:0)}
});
export function rank(question, sources, strategy='keyword') {
  if (!Object.hasOwn(strategies, strategy)) throw Error('Unknown strategy');
  return [...sources].map(s=>({id:s.id,score:strategies[strategy].score(question,s)})).sort((a,b)=>b.score-a.score || a.id.localeCompare(b.id));
}
export function evaluate(dataset,strategy) {
  const hits=dataset.reduce((sum,q)=>sum+(rank(q,dataset.sources,strategy)[0]?.id===q.expected?1:0),0);
  return {strategy,correct:hits,total:dataset.length,accuracy:hits/dataset.length};
}
export function chooseOnTraining(training) {
  return Object.keys(strategies).map(strategy=>evaluate(training,strategy)).sort((a,b)=>b.accuracy-a.accuracy || a.strategy.localeCompare(b.strategy))[0].strategy;
}
