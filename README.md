# Mosquito Research Lab

Open-source, evidence-grounded investigation of mosquito sensory biology and a reusable recursive research scientist.

## Two independent tracks
- `research/mosquito/`: mosquito neuroscience, wind, rain, humidity, vision, acoustics and electrostatic-field literature.
- `packages/research-scientist/`: domain-neutral hypothesis and evidence evaluation, later Ruflo / RuVector RSI integration.

## Principles
1. Published observations are not interchangeable with hypotheses.
2. Every claim has a traceable source and explicit limitations.
3. Failed hypotheses remain in the ledger.
4. Recursive strategies are compared with a frozen baseline on held-out questions.
5. No self-grading or rewriting evaluation results.
6. No unreviewed high-voltage, radiation, or chemical experiments.

## Run
Requires Node.js 20+.

```sh
npm test
npm run experiment
npm run investigate
npm run benchmark
```

The investigation command produces evidence review packets for wind and rain. The synthetic benchmark records each training prediction before incorporating its feedback and compares the final strategy against the fixed baseline on separate questions. See [the roadmap](docs/ROADMAP.md) and [the compatibility probe](integrations/ruvector/UPSTREAM.md).
