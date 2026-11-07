# Upstream research (2026-11-07)

## Confirmed upstream repositories
- Ruflo: https://github.com/ruvnet/ruflo
- RuVector: https://github.com/ruvnet/RuVector

Ruflo's README describes a Codex-compatible MCP server using `npx -y ruflo@latest mcp start` and project initialization via `npx ruflo@latest init`. The official installation wiki specifies Node.js 20+ and npm 9+.

RuVector describes vector search, persistent agent memory, graph relationships, and optional learning primitives. **These are not proof that autonomous recursive self-improvement is active.**

## Environment plan
1. GitHub Actions smoke test: inspect package metadata and Ruflo CLI in an isolated runner.
2. Only after successful runner results: pin the exact version and verify the needed command/API behavior.
3. Implement a Ruflo research-task adapter and RuVector evidence-memory adapter with contract tests.
4. Keep LLM providers optional, with secrets configured through GitHub Actions, never committed.
5. Require explicit approval for costs, network-intensive runs, or write-capable autonomous agents.
6. Preserve held-out benchmarks and independent evidence review.

## Security
The smoke test does not launch MCP, daemon, swarms, or untrusted research agents. It uses `npm install --ignore-scripts` and read-only GitHub token permissions. Installing external dependencies still entails supply-chain risk. Review and pin versions before production use.

## Current status
Workflow committed; execution and compatibility remain **unverified** until GitHub Actions results are inspected.
