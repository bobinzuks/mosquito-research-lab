import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { investigate } from '../packages/research-scientist/investigation.mjs';
import { learnFromFeedback } from '../packages/research-scientist/learning.mjs';

const data = JSON.parse(readFileSync(new URL('../experiments/synthetic-questions.json', import.meta.url), 'utf8'));

test('mosquito entry point preserves provenance, challenges and missing evidence', () => {
  const runner = fileURLToPath(new URL('../research/mosquito/run-investigations.mjs', import.meta.url));
  const [wind, rain] = JSON.parse(execFileSync(process.execPath, [runner], { encoding: 'utf8' }));
  const challenge = wind.assessments[1].observations[0];
  assert.equal(challenge.relation, 'challenges');
  assert.equal(challenge.record.source.doi, '10.1603/0022-2585-40.5.607');
  assert.equal(challenge.record.reviewStatus, 'source-inspected');
  assert.ok(challenge.record.limitations);
  assert.equal(wind.assessments[0].status, 'pending-independent-review');
  assert.deepEqual(rain.assessments[1].gaps, ['no-linked-support', 'no-linked-challenge']);
});

test('dangling evidence references fail rather than entering the review report', () => {
  assert.throws(() => investigate({
    question: { id: 'q', text: 'Which mechanism?' },
    hypotheses: [
      { id: 'h1', prediction: 'Outcome A', links: [{ evidenceId: 'missing', relation: 'supports', rationale: 'Claim' }] },
      { id: 'h2', prediction: 'Outcome B', links: [] },
    ],
    evidence: [],
  }), /Invalid evidence link/);
});

test('learning retains failures and only selects from training feedback', () => {
  const dataset = { ...data, train: [data.train[1], data.train[0], data.train[2]] };
  const result = learnFromFeedback(dataset);
  assert.equal(result.cycles[0].strategy, 'keyword');
  assert.equal(result.cycles[0].correct, false);
  assert.equal(result.cycles[1].strategy, result.cycles[0].nextStrategy);
  assert.equal(result.improved, false);

  const changed = learnFromFeedback({
    ...dataset,
    holdout: data.holdout.map(question => ({ ...question, expected: 'elec' })),
  });
  assert.deepEqual(changed.cycles, result.cycles);
  assert.equal(changed.selectedStrategy, result.selectedStrategy);
  assert.notDeepEqual(changed.candidate, result.candidate);
});

test('duplicate question terms cannot appear across the training and holdout splits', () => {
  assert.throws(() => learnFromFeedback({
    ...data,
    train: [{ ...data.holdout[0], terms: [...data.holdout[0].terms].reverse() }],
  }), /Repeated question/);
});
