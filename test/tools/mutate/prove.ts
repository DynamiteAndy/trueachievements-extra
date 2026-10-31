// The mutation check: proves whether a test is needed, and whether it can fail. Nothing in the repo is written: every
// change is made in memory by vitest.mutate.config.ts. Run with `pnpm test:mutate <experiments.json> [id]`; the
// experiments file can live anywhere (e.g. a scratchpad), and the results are written beside it as results-<name>.json,
// with each run's Vitest output in <name>-runs/ (so sessions running at once, each with its own experiments file, never
// read each other's).
// A test file that failed with none of its tests failing (its worker crashed, say from a break that loops until memory
// runs out, or its beforeAll threw) counts as a catch, as does a run that times out: each fails a plain run too.
//
// Two kinds of experiment:
// - "mut" { id, kind: 'mut', spec: [...], muts: [{ file, from, to, line?, nth? }], cand: [{ file, line, name? }] }
//   breaks source lines, then reports whether each candidate test fails and which other tests fail. A candidate is
//   redundant for that break if something else fails too. A test that passes but leaves an unhandled error (which
//   fails a plain run) counts as a catch: its status is "unhandled", and every such error is listed.
// - "cov" { id, kind: 'cov', spec: [...], skip: [{ file, line }], sources: [...] }
//   skips the candidate tests and reports the statements, branches and functions of `sources` no longer covered.
//
// A test is proven redundant when skipping it loses no coverage and every break it catches also fails another test.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Mutation } from './vitest.mutate.config.ts';

type Candidate = { file: string; line: number; name?: string };
type Skip = { file: string; line: number } | Mutation;
type Experiment =
  | { id: string; kind: 'mut'; spec: string[]; muts: Mutation[]; cand?: Candidate[] }
  | { id: string; kind: 'cov'; spec: string[]; skip: Skip[]; sources: string[] };
type TestResult = { file: string; line: number; name: string; status: string };
// An error Vitest caught outside any test's assertions (an unhandled rejection): it fails a plain run, so it's a catch,
// named by the file and the last test that ran before it
type Unhandled = { file: string; name: string };
type Run = { err?: string; tests: TestResult[]; applied?: number; unhandled: Unhandled[] };
type JsonReport = {
  testResults: {
    name: string;
    status: string;
    message?: string;
    assertionResults: { fullName: string; status: string; location?: { line: number } }[];
  }[];
};
type Coverage = Record<
  string,
  {
    s: Record<string, number>;
    statementMap: Record<string, { start: { line: number; column: number } }>;
    b: Record<string, number[]>;
    branchMap: Record<
      string,
      { loc: { start: { line: number; column: number } }; locations: { start: { line: number; column: number } }[] }
    >;
    f: Record<string, number>;
    fnMap: Record<string, { name: string; decl: { start: { line: number } } }>;
  }
>;

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../..');
const config = path.join(here, 'vitest.mutate.config.ts');
const vitest = path.join(repo, 'node_modules/vitest/vitest.mjs');
// A break that loops without running out of memory would otherwise never end
const runTimeoutMs = 10 * 60 * 1000;

const [experimentsFile, only] = process.argv.slice(2);
if (!experimentsFile) {
  console.error('Usage: pnpm test:mutate <experiments.json> [id]');
  process.exit(1);
}
const outDir = path.join(
  path.dirname(path.resolve(experimentsFile)),
  `${path.basename(experimentsFile, path.extname(experimentsFile))}-runs`
);
const experiments = JSON.parse(fs.readFileSync(experimentsFile, 'utf8')) as Experiment[];

const normalise = (file: string): string => file.replaceAll('\\', '/').toLowerCase();
const relative = (file: string): string => normalise(file).replace(`${normalise(repo)}/`, '');

const run = (tag: string, spec: string[], mutations: Mutation[], extra: string[] = []): Run => {
  const out = path.join(outDir, `${tag}.json`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.rmSync(out, { force: true });
  const result = spawnSync(
    process.execPath,
    // The default reporter too, as only it prints the unhandled errors
    [
      vitest,
      'run',
      '--config',
      config,
      '--reporter=json',
      '--reporter=default',
      `--outputFile.json=${out}`,
      ...extra,
      ...spec
    ],
    {
      cwd: repo,
      env: { ...process.env, MUTATE: JSON.stringify(mutations) },
      encoding: 'utf8',
      maxBuffer: 1 << 28,
      timeout: runTimeoutMs
    }
  );
  const log = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  if (result.error && 'code' in result.error && result.error.code === 'ETIMEDOUT') {
    return {
      tests: [{ file: '(run)', line: 0, name: `(timed out after ${runTimeoutMs / 60_000} minutes)`, status: 'failed' }],
      unhandled: []
    };
  }
  // A mutation whose file no spec loads is never transformed, so it fails nothing: name it rather than pass it
  const applied = new Set([...log.matchAll(/MUTATION APPLIED #(\d+)/g)].map(([, index]) => Number(index)));
  const missed = mutations.flatMap((mutation, index) => (applied.has(index) ? [] : [mutation.file]));
  const err =
    /MUTATION (NOT APPLIED|AMBIGUOUS)[^\n]*/.exec(log)?.[0] ??
    (missed.length ? `MUTATION NOT APPLIED: no spec loaded ${missed.join(', ')}` : undefined);
  const unhandled = [
    ...log.matchAll(
      /This error originated in "([^"]+)" test file\.[^\n]*\n(?:The last test to run before this error was "([^\n]*)"\.)?/g
    )
  ].map(([, file, name]) => ({ file: relative(file), name: name ?? '' }));
  if (!fs.existsSync(out)) {
    return { err: err ?? `no json output: ${log.slice(-500)}`, tests: [], unhandled };
  }

  const report = JSON.parse(fs.readFileSync(out, 'utf8')) as JsonReport;
  const tests = report.testResults.flatMap((file): TestResult[] => {
    const results = file.assertionResults.map((test) => ({
      file: relative(file.name),
      line: test.location?.line ?? 0,
      name: test.fullName,
      status: test.status
    }));
    // A file that failed with none of its tests failing (none run, or all left pending by a crashed worker)
    const fileOnly = file.status === 'failed' && !results.some((test) => test.status === 'failed');

    return fileOnly
      ? [
          ...results,
          {
            file: relative(file.name),
            line: 0,
            name: `(file failed) ${(file.message || 'its worker exited').slice(0, 200)}`,
            status: 'failed'
          }
        ]
      : results;
  });
  return { err, tests, applied: applied.size, unhandled };
};

// The test an unhandled error is put down to: the last one to run before it
const causedUnhandled = (test: TestResult, unhandled: Unhandled[]): boolean =>
  unhandled.some((error) => error.file === test.file && error.name !== '' && test.name.endsWith(error.name));

const matches = (test: TestResult, candidate: Candidate): boolean =>
  test.file === normalise(candidate.file) &&
  (candidate.name ? test.name.includes(candidate.name) : test.line === candidate.line);

// A skip is a mutation turning that line's test into a skipped one
const skipMutation = (skip: Skip): Mutation => {
  if ('from' in skip) {
    return skip;
  }
  const line = fs.readFileSync(path.join(repo, skip.file), 'utf8').split('\n')[skip.line - 1] ?? '';
  for (const [from, to] of [
    ['test.each', 'test.skip.each'],
    ['test(', 'test.skip('],
    ['it(', 'it.skip(']
  ]) {
    if (line.includes(from)) {
      return { file: skip.file, line: skip.line, from, to };
    }
  }
  throw new Error(`no test on ${skip.file}:${skip.line}: ${line}`);
};

const covered = (dir: string, sources: string[]): Set<string> => {
  const coverage = JSON.parse(fs.readFileSync(path.join(dir, 'coverage-final.json'), 'utf8')) as Coverage;
  const reached = new Set<string>();
  for (const [file, counts] of Object.entries(coverage)) {
    if (!sources.some((source) => source.includes('*') || normalise(file).endsWith(normalise(source)))) {
      continue;
    }
    const name = relative(file);
    for (const [key, hits] of Object.entries(counts.s)) {
      if (hits > 0) {
        const { line, column } = counts.statementMap[key].start;
        reached.add(`${name}:${line}:${column} stmt`);
      }
    }
    for (const [key, arms] of Object.entries(counts.b)) {
      arms.forEach((hits, arm) => {
        if (hits > 0) {
          const { line, column } = (counts.branchMap[key].locations[arm] ?? counts.branchMap[key].loc).start;
          reached.add(`${name}:${line}:${column} branch#${arm}`);
        }
      });
    }
    for (const [key, hits] of Object.entries(counts.f)) {
      if (hits > 0) {
        reached.add(`${name}:${counts.fnMap[key].decl.start.line} fn ${counts.fnMap[key].name}`);
      }
    }
  }
  return reached;
};

const coverageRun = (
  tag: string,
  spec: string[],
  mutations: Mutation[],
  sources: string[]
): Run & { reached: Set<string> | null } => {
  const dir = path.join(outDir, `cov-${tag}`);
  fs.rmSync(dir, { recursive: true, force: true });
  const result = run(tag, spec, mutations, [
    '--coverage.enabled',
    '--coverage.reporter=json',
    ...sources.map((source) => `--coverage.include=${source}`),
    `--coverage.reportsDirectory=${dir}`
  ]);
  return {
    ...result,
    reached: fs.existsSync(path.join(dir, 'coverage-final.json')) ? covered(dir, sources) : null
  };
};

const results: Record<string, unknown> = {};
const baselines = new Map<string, ReturnType<typeof coverageRun>>();
for (const experiment of experiments) {
  if (only && experiment.id !== only) {
    continue;
  }

  let result: unknown;
  if (experiment.kind === 'mut') {
    const { err, applied, tests, unhandled } = run(experiment.id, experiment.spec, experiment.muts);
    const candidates = experiment.cand ?? [];
    const isCandidate = (test: TestResult): boolean => candidates.some((candidate) => matches(test, candidate));
    // A test that passed but left an unhandled error fails a plain run, so it counts as caught ("unhandled")
    const status = (test: TestResult): string =>
      test.status === 'passed' && causedUnhandled(test, unhandled) ? 'unhandled' : test.status;
    result = {
      err,
      applied,
      total: tests.length,
      candidates: candidates.map((candidate) => {
        const found = tests.filter((test) => matches(test, candidate));
        const label = `${candidate.file}:${candidate.line}${candidate.name ? ` [${candidate.name}]` : ''}`;
        return `${label} ${found.length ? found.map(status).join(',') : 'NOT FOUND'}`;
      }),
      othersFailed: tests
        .filter((test) => (test.status === 'failed' || status(test) === 'unhandled') && !isCandidate(test))
        .map((test) => `${test.file}:${test.line} ${test.name}${status(test) === 'unhandled' ? ' (unhandled)' : ''}`),
      // Every unhandled error, including any put down to no test
      unhandled: unhandled.map((error) => `${error.file} after "${error.name}"`)
    };
  } else {
    const key = JSON.stringify([experiment.spec, experiment.sources]);
    const all = baselines.get(key) ?? coverageRun(`${experiment.id}-all`, experiment.spec, [], experiment.sources);
    baselines.set(key, all);
    const skipped = coverageRun(
      `${experiment.id}-skip`,
      experiment.spec,
      experiment.skip.map(skipMutation),
      experiment.sources
    );
    result = {
      err: all.err ?? skipped.err,
      totalAll: all.tests.length,
      failedAll: all.tests.filter((test) => test.status === 'failed').length,
      failedSkip: skipped.tests.filter((test) => test.status === 'failed').length,
      skipped: skipped.tests
        .filter((test) => test.status === 'skipped' || test.status === 'pending')
        .map((test) => `${test.file}:${test.line}`),
      coveredAll: all.reached?.size,
      coveredSkip: skipped.reached?.size,
      lost:
        all.reached && skipped.reached
          ? [...all.reached].filter((entry) => !skipped.reached?.has(entry))
          : 'no coverage'
    };
  }
  results[experiment.id] = result;
  console.log(experiment.id, JSON.stringify(result));
}

const resultsFile = path.join(path.dirname(experimentsFile), `results-${path.basename(experimentsFile)}`);
let previous: Record<string, unknown> = {};
try {
  previous = JSON.parse(fs.readFileSync(resultsFile, 'utf8')) as Record<string, unknown>;
} catch {
  // No earlier results
}
fs.writeFileSync(resultsFile, JSON.stringify({ ...previous, ...results }, null, 1));
