import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { learnFromFeedback } from '../packages/research-scientist/learning.mjs';

const data = JSON.parse(readFileSync(new URL('./synthetic-questions.json', import.meta.url), 'utf8'));
const report = {
  synthetic: true,
  disclaimer: 'Synthetic source ranking with cumulative training feedback. No strategy promotion is performed.',
  ...learnFromFeedback(data),
};
mkdirSync('reports', { recursive: true });
writeFileSync('reports/latest.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
