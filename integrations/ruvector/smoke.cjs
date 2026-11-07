const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

async function main() {
  if (!process.argv[2]) throw new Error('Pass the isolated npm install prefix');
  const prefix = resolve(process.argv[2]);
  const load = createRequire(join(prefix, 'package.json'));
  const { Client } = load('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = load('@modelcontextprotocol/sdk/client/stdio.js');
  const { SonaEngine } = load('@ruvector/sona');
  const cwd = mkdtempSync(join(tmpdir(), 'research-smoke-'));
  const binary = name => join(prefix, 'node_modules', '.bin', name);
  const run = (name, ...args) => execFileSync(binary(name), args, {
    cwd, encoding: 'utf8', timeout: 15_000,
  });

  const client = new Client({ name: 'research-compatibility-smoke', version: '1.0.0' });
  try {
    const ruflo = run('ruflo', '--version').trim();
    const ruvector = run('ruvector', '--version').trim();
    assert.equal(ruflo, 'ruflo v3.72.2');
    assert.equal(ruvector, '0.3.14');

    await client.connect(new StdioClientTransport({
      command: binary('ruflo'), args: ['mcp', 'start'], cwd, stderr: 'pipe',
    }), { timeout: 15_000 });
    const names = new Set();
    let cursor;
    do {
      const page = await client.listTools(cursor ? { cursor } : {}, { timeout: 15_000 });
      for (const tool of page.tools) names.add(tool.name);
      cursor = page.nextCursor;
    } while (cursor);
    assert.ok(names.has('memory_search'));
    assert.ok(names.has('swarm_init'));

    const db = join(cwd, 'vectors');
    const fixture = join(cwd, 'vectors.json');
    writeFileSync(fixture, JSON.stringify([
      { id: 'fixture-match', vector: [1, 0], metadata: { provenance: 'synthetic' } },
      { id: 'fixture-other', vector: [0, 1] },
    ]));
    run('ruvector', 'create', db, '--dimension', '2');
    run('ruvector', 'insert', db, fixture);
    const nearest = run('ruvector', 'search', db, '--vector', '[1,0]', '--top-k', '1');
    assert.match(nearest, /fixture-match/);
    assert.doesNotMatch(nearest, /fixture-other/);

    const harness = JSON.parse(run('ruvector', 'harness', 'doctor', '--json'));
    const darwin = harness.primitives['metaharness.darwin'];
    assert.equal(darwin.available, true);

    const sona = SonaEngine.withConfig({ hiddenDim: 8, trajectoryCapacity: 16 });
    const vector = [1, 0, 0, 0, 0, 0, 0, 0];
    const trajectory = sona.beginTrajectory(vector);
    sona.setTrajectoryRoute(trajectory, 'smoke');
    sona.addTrajectoryStep(trajectory, vector, [1], 1);
    sona.endTrajectory(trajectory, 1);
    sona.forceLearn();
    assert.equal(JSON.parse(sona.getStats()).patterns_learned, 1);
    assert.equal(sona.findPatterns(vector, 1)[0]?.clusterSize, 1);
    console.log(JSON.stringify({ ruflo, ruvector, mcpTools: names.size, nearest: 'fixture-match', sonaPatterns: 1, darwinLoaded: darwin.version }));
  } finally {
    await client.close();
    rmSync(cwd, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
