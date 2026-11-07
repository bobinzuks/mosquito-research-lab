import { compareStrategies } from './evidence.mjs';
import { chooseOnTraining, rank } from './strategy.mjs';

export function learnFromFeedback({ sources, train, holdout }) {
  const sourceIds = new Set(sources.map(source => source.id));
  if (sourceIds.size !== sources.length || !train.length || !holdout.length) {
    throw new Error('Unique sources and nonempty training and holdout splits required');
  }

  const seen = new Set();
  for (const { terms, expected } of [...train, ...holdout]) {
    if (!terms?.length || terms.some(term => typeof term !== 'string' || !term.trim()) ||
        !sourceIds.has(expected)) {
      throw new Error('Each question requires search terms and a known expected source');
    }
    const key = JSON.stringify([...new Set(terms.map(term => term.toLowerCase().trim()))].sort());
    if (seen.has(key)) throw new Error('Repeated question in benchmark splits');
    seen.add(key);
  }

  const baselineStrategy = 'keyword';
  let selectedStrategy = baselineStrategy;
  const feedback = Object.assign([], { sources });
  const cycles = train.map(({ terms, expected }) => {
    const strategy = selectedStrategy;
    const predicted = rank({ terms }, sources, strategy)[0]?.id;
    feedback.push({ terms, expected });
    selectedStrategy = chooseOnTraining(feedback);
    return { terms: [...terms], strategy, predicted, expected, correct: predicted === expected, nextStrategy: selectedStrategy };
  });

  const baseline = score(holdout, sources, baselineStrategy);
  const candidate = score(holdout, sources, selectedStrategy);
  return { baselineStrategy, selectedStrategy, cycles, baseline, candidate, ...compareStrategies(baseline, candidate) };
}

function score(questions, sources, strategy) {
  const correct = questions.filter(({ terms, expected }) =>
    rank({ terms }, sources, strategy)[0]?.id === expected).length;
  return { correct, total: questions.length };
}
