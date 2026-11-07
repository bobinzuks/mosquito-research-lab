# Cloud compatibility check

Verified on Linux x64 with Node.js 24.22.1 and npm 11.9.0 on 2026-11-07. The lab's normal commands use Node alone.

| Component | Version | What the probe checks |
| --- | --- | --- |
| [Ruflo](https://github.com/ruvnet/ruflo) | 3.72.2 | Local stdio MCP initialization and tool discovery, including `memory_search` and `swarm_init` |
| [RuVector](https://github.com/ruvnet/RuVector) | 0.3.14 | Creates an isolated vector store, inserts two synthetic vectors, and retrieves the expected top hit across CLI invocations |
| [SONA](https://github.com/ruvnet/RuVector/tree/main/crates/sona) | 0.1.11 | Native Node binding records one synthetic trajectory, learns one pattern and retrieves it |
| [MetaHarness Darwin](https://github.com/ruvnet/metaharness/blob/main/docs/adrs/ADR-070-darwin-mode-self-improving-harness.md) | 0.13.0 observed | RuVector's harness doctor imports the package successfully |

Ruflo and RuVector both declare Node.js 20+ and MIT in their npm metadata. SONA learns from feedback trajectories. Darwin explores and evaluates changes to a harness. The probe checks local primitives only. It calls no MCP tools, starts no swarm, and executes no Darwin candidates. The research engine still needs an independent evaluation dataset and an adapter before either learning system can affect research decisions.

## Repeat the smoke test

Run from the repository root on Linux with npm registry access. The exact top-level versions below were tested with lifecycle scripts disabled. Transitive dependency versions are resolved by npm.

```sh
probe="$(mktemp -d)"
npm install --prefix "$probe" --ignore-scripts --no-audit --no-fund \
  ruflo@3.72.2 ruvector@0.3.14 @ruvector/sona@0.1.11 @modelcontextprotocol/sdk@1.32.2
timeout 75s node integrations/ruvector/smoke.cjs "$probe"
rm -rf -- "$probe"
```
