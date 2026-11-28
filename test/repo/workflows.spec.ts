import fs from 'node:fs';
import path from 'node:path';

import { parse } from 'yaml';

interface Step {
  name?: string;
  if?: string;
  id?: string;
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
}

interface Workflow {
  on: {
    push?: { branches?: string[]; paths?: string[] };
    pull_request?: { paths?: string[] } | null;
    workflow_dispatch?: unknown;
    schedule?: { cron: string }[];
  };
  concurrency?: { group?: string; 'cancel-in-progress'?: boolean };
  permissions?: Record<string, string>;
  jobs: Record<
    string,
    {
      needs?: string | string[];
      if?: string;
      'timeout-minutes'?: number;
      permissions?: Record<string, string>;
      outputs?: Record<string, string>;
      steps: Step[];
    }
  >;
}

const workflowNames = ['ci', 'release-dist', 'auto-release', 'cleanup', 'held-runs'];

// From the repo's root, whatever the working folder
const root = path.resolve(import.meta.dirname, '../..');

const workflow = (name: string): Workflow =>
  parse(fs.readFileSync(path.join(root, '.github/workflows', `${name}.yml`), 'utf8')) as Workflow;

const pnpmRuns = (steps: { run?: string }[]): string[] =>
  steps.flatMap(({ run }) => (run?.startsWith('pnpm run') ? [run] : []));

const onlyJob = (name: string): Workflow['jobs'][string] => {
  const jobs = Object.values(workflow(name).jobs);

  expect(jobs).toHaveLength(1);

  return jobs[0];
};

// A missing step fails the spec here, rather than as a vague mismatch
const runOf = (steps: Step[], stepName: string): string => {
  const run = steps.find(({ name }) => name === stepName)?.run;

  if (run === undefined) {
    throw new Error(`No step named "${stepName}" with a run`);
  }

  return run;
};

// Only the steps that push may hold the token, so nothing the install or build runs can push with it
const tokenSteps = (steps: Step[]): string[] =>
  steps.flatMap(({ name, env }) =>
    Object.values(env ?? {}).some((value) => value.includes('secrets.GITHUB_TOKEN')) ? [name ?? ''] : []
  );

describe('.github/workflows/ci.yml', () => {
  // Other branches run through their pull request, so a branch with one isn't checked twice for each push
  test('runs on a push to main only', () => {
    expect(workflow('ci').on.push?.branches).toEqual(['main']);
  });

  // A pull request from a fork pushes nothing here
  test('runs on pull requests', () => {
    expect(Object.keys(workflow('ci').on)).toContain('pull_request');
  });

  // The release dist build starts it on the commit it pushes, which no push event checks
  test('can be started by a dispatch', () => {
    expect(Object.keys(workflow('ci').on)).toContain('workflow_dispatch');
  });

  test('cancels a run superseded by a newer push to the same pull request or branch', () => {
    expect(workflow('ci').concurrency).toEqual({
      group: '${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}',
      'cancel-in-progress': true
    });
  });

  test('lints, tests and builds side by side, lint checking the lockfile matches package.json', () => {
    const { jobs } = workflow('ci');

    expect(pnpmRuns(jobs.lint.steps)).toEqual(['pnpm run lint --format github']);
    expect(jobs.lint.steps.map(({ run }) => run)).toContain('pnpm install --frozen-lockfile --lockfile-only');
    expect(pnpmRuns(jobs.test.steps)).toEqual(['pnpm run test:github']);
    expect(pnpmRuns(jobs.build.steps)).toEqual(['pnpm run build:prod-all', 'pnpm run build:dev']);
    expect(jobs.lint.needs).toBe('dist-only');
    expect(jobs.test.needs).toBe('dist-only');
    expect(jobs.build.needs).toBe('dist-only');
    expect(jobs.build.if).toBe(jobs.lint.if);
  });

  // The dist commit's code is the commit before's, so that commit's CI result stands for it; anything else runs it all
  test('skips lint and test only for a dispatched commit that adds nothing but dist, once the commit before passed', () => {
    const { jobs } = workflow('ci');
    const wait = jobs['dist-only'].steps.find(({ id }) => id === 'parent');

    expect(jobs['dist-only'].outputs).toEqual({ passed: '${{ steps.parent.outputs.passed }}' });
    expect(jobs['dist-only'].permissions).toEqual({ contents: 'read', actions: 'read' });
    expect(wait?.if).toBe("${{ github.event_name == 'workflow_dispatch' }}");
    expect(wait?.run).toContain("git diff --quiet HEAD^ HEAD -- . ':(exclude)dist/*.js'");
    expect(wait?.run).toContain('--workflow ci.yml --event pull_request');
    expect(wait?.run).toContain('gh run watch "$RUN_ID" --exit-status');

    for (const name of ['lint', 'test']) {
      expect(jobs[name].if, name).toBe("${{ needs.dist-only.outputs.passed != 'true' }}");
    }
  });

  // main's ruleset requires the check by this name; it must still run, and fail, when a job before it fails
  // The prune is left out, so deleting runs can never fail a pull request (and it's skipped on main and dispatches)
  test('ends with the ci check, which waits for every other job but the prune, whatever their result', () => {
    const { jobs } = workflow('ci');

    expect(Object.keys(jobs)).toEqual(['dist-only', 'lint', 'test', 'build', 'prune-old-runs', 'ci']);
    expect(jobs.ci.needs).toEqual(['dist-only', 'lint', 'test', 'build']);
    expect(jobs.ci.if).toBe('${{ always() }}');
    expect(jobs.ci.steps).toEqual([
      {
        name: 'Fail unless every job passed',
        if: "${{ contains(needs.*.result, 'failure') || contains(needs.*.result, 'cancelled') || (needs.dist-only.outputs.passed != 'true' && contains(needs.*.result, 'skipped')) }}",
        run: 'exit 1'
      }
    ]);
  });

  // A pull request's runs pile up with every push; a dist commit's dispatched run checks its parent's CI (dist-only)
  test("prunes a pull request's finished runs before its previous commit, running none of its code", () => {
    const job = workflow('ci').jobs['prune-old-runs'];
    const run = runOf(job.steps, "Delete the pull request's finished runs from before its previous commit");

    expect(job.if).toBe(
      "${{ github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository }}"
    );
    expect(job.permissions).toEqual({ actions: 'write' });
    expect(job.steps.map(({ uses }) => uses).filter(Boolean)).toEqual([]);
    expect(runsProjectCode(job)).toEqual([]);
    // The pull request's latest commit, not the event's, so a re-run of an old run can't take newer runs
    expect(run).toContain('"repos/$GITHUB_REPOSITORY/pulls/$PR_NUMBER" --jq \'.head.sha\'');
    expect(run).toContain("--jq '.parents[0].sha'");
    // Without the export, jq's env.PARENT is null and the parent's runs (which dist-only reads) would go
    expect(run).toContain('export HEAD_SHA PARENT');
    // A failed lookup warns rather than fails
    expect(run).toContain('exit 0');
    expect(run).toContain('-f branch="$HEAD_REF" -f status=completed');
    expect(run).toContain('.head_sha != env.HEAD_SHA and .head_sha != env.PARENT');
    expect(run).toContain('.head_repository.full_name == env.GITHUB_REPOSITORY');
    expect(run).toContain('gh run delete "$RUN_ID"');
    expect(run).not.toContain('${{');
  });

  // Pushes to main and the dispatched run build only what ships, with no extra job or run for the dev config
  test('builds the dev script on pull requests only', () => {
    const step = workflow('ci').jobs.build.steps.find(({ run }) => run === 'pnpm run build:dev');

    expect(step?.if).toBe("${{ github.event_name == 'pull_request' }}");
  });

  // Coverage and Test Analytics, each from its own file, and uploaded after failing tests too
  test('uploads coverage and test results to Codecov, each naming its file', () => {
    const uploads = workflow('ci').jobs.test.steps.filter(({ uses }) => uses?.startsWith('codecov/codecov-action@'));

    expect(uploads.map((step) => [step.if, step.with])).toEqual([
      ['${{ !cancelled() }}', { files: './dist/coverage/lcov.info', disable_search: true }],
      [
        '${{ !cancelled() }}',
        { report_type: 'test_results', files: './dist/coverage/test-report.junit.xml', disable_search: true }
      ]
    ]);
  });

  // The release scripts users install come from dist/ on main: only the release build, on this repository's version
  // bump, may change them
  test('fails a pull request from a fork, or one that keeps the version, that changes dist', () => {
    const { steps } = workflow('ci').jobs.lint;
    const check = steps.find(({ name }) => name === "Check the pull request's changes to dist");

    expect(steps[0].with).toMatchObject({ 'fetch-depth': 2, 'persist-credentials': false });
    expect(check?.if).toBe("${{ github.event_name == 'pull_request' }}");
    expect(check?.env).toEqual({
      FROM_FORK: '${{ github.event.pull_request.head.repo.full_name != github.repository }}'
    });
    expect(check?.run).toContain("git diff --quiet HEAD^1 HEAD -- 'dist/*.js'");
    expect(check?.run).toContain('if [ "$FROM_FORK" = "true" ]; then');
    expect(check?.run).toContain('"$(git show HEAD^1:package.json | version)" = "$(version < package.json)"');
  });

  test('sets up each job through the shared setup action', () => {
    const { jobs } = workflow('ci');

    for (const name of ['lint', 'test', 'build']) {
      expect(jobs[name].steps.map(({ uses }) => uses)).toContain('./.github/actions/setup');
    }
  });

  // CI has no type-check job of its own, so without these it would stop type-checking without a word
  test("keeps lint's type check on", () => {
    const { options } = JSON.parse(fs.readFileSync(path.join(root, '.oxlintrc.json'), 'utf8')) as {
      options?: { typeAware?: boolean; typeCheck?: boolean };
    };

    expect(options).toMatchObject({ typeAware: true, typeCheck: true });
  });
});

// A hung run would otherwise hold a runner for GitHub's default of six hours
// A workflow's job by name; a missing one fails the spec here
const jobOf = (name: string, jobName: string): Workflow['jobs'][string] => {
  const job = workflow(name).jobs[jobName];

  if (job === undefined) {
    throw new Error(`No job named "${jobName}" in ${name}`);
  }

  return job;
};

// A job that holds a write token runs none of the project's code: no setup (the install), no pnpm, no node, and no
// action of the repository's own
const runsProjectCode = ({ steps }: Workflow['jobs'][string]): string[] =>
  steps.flatMap(({ name, uses, run }) =>
    uses?.startsWith('./') || (run !== undefined && /\b(pnpm|npm|npx|node|corepack)\b/u.test(run)) ? [name ?? ''] : []
  );

describe('every workflow job', () => {
  test.each(workflowNames)('%s caps each job: 5 minutes for the ci check, 15 for the rest', (name) => {
    for (const [jobName, job] of Object.entries(workflow(name).jobs)) {
      expect(job['timeout-minutes'], jobName).toBe(jobName === 'ci' ? 5 : 15);
    }
  });

  // The repository's default token can write, so a workflow without its own permissions would get that
  test.each(workflowNames)('%s declares its permissions, at the top or on every job', (name) => {
    const { permissions, jobs } = workflow(name);
    const jobsWithout = Object.entries(jobs).flatMap(([jobName, job]) => (job.permissions ? [] : [jobName]));

    expect(permissions === undefined ? jobsWithout : []).toEqual([]);
  });

  // A tag can be moved to other code; a commit can't. Dependabot moves the pins on (.github/dependabot.yml)
  test('runs every action from outside the repository pinned to a commit', () => {
    const files = [
      ...workflowNames.map((name) => `.github/workflows/${name}.yml`),
      ...fs.readdirSync(path.join(root, '.github/actions')).map((action) => `.github/actions/${action}/action.yml`)
    ];
    const unpinned = files.flatMap((file) =>
      fs
        .readFileSync(path.join(root, file), 'utf8')
        .split('\n')
        .flatMap((line) => {
          const uses = /uses:\s*(\S+)/u.exec(line)?.[1];
          return uses && !uses.startsWith('./') && !/@[0-9a-f]{40}$/u.test(uses) ? [`${file}: ${uses}`] : [];
        })
    );

    expect(unpinned).toEqual([]);
  });

  test('covers every workflow file', () => {
    const files = fs.readdirSync(path.join(root, '.github/workflows')).map((file) => file.replace(/\.yml$/u, ''));

    expect(files.toSorted()).toEqual(workflowNames.toSorted());
  });
});

describe('.github/workflows/release-dist.yml', () => {
  // A release is a pull request bumping the version; the filter looks at the whole pull request, so later
  // pushes rebuild. Marking a draft ready builds it
  test('runs on pull requests that change package.json, and when one is marked ready for review', () => {
    expect(workflow('release-dist').on).toEqual({
      pull_request: { types: ['opened', 'synchronize', 'reopened', 'ready_for_review'], paths: ['package.json'] }
    });
  });

  test('cancels a build superseded by a newer push to the same pull request', () => {
    expect(workflow('release-dist').concurrency).toEqual({
      group: '${{ github.workflow }}-${{ github.event.pull_request.number }}',
      'cancel-in-progress': true
    });
  });

  test('builds, then publishes what was built', () => {
    expect(Object.keys(workflow('release-dist').jobs)).toEqual(['build', 'publish']);
    expect(jobOf('release-dist', 'publish').needs).toBe('build');
  });

  // A fork's pull request gets a read-only token; a draft's build would add a commit and runs on every push. The
  // publish job needs the build, so it's skipped with it
  test('skips drafts and pull requests from forks, and builds with a read-only token', () => {
    const job = jobOf('release-dist', 'build');

    expect(job.if).toBe(
      '${{ github.event.pull_request.head.repo.full_name == github.repository && !github.event.pull_request.draft }}'
    );
    expect(job.permissions).toEqual({ contents: 'read' });
    expect(tokenSteps(job.steps)).toEqual([]);
  });

  test("builds the release scripts on the pull request's own commit, set up through the shared action, kept as an artifact", () => {
    const { steps } = jobOf('release-dist', 'build');

    expect(steps[0].with).toMatchObject({
      ref: '${{ github.event.pull_request.head.sha }}',
      'persist-credentials': false
    });
    expect(steps.map(({ uses }) => uses)).toContain('./.github/actions/setup');
    expect(pnpmRuns(steps)).toEqual(['pnpm run build:release']);
    expect(steps.find(({ uses }) => uses?.startsWith('actions/upload-artifact@'))?.with).toMatchObject({
      name: 'release-dist',
      path: 'dist/*.js'
    });
  });

  // Anything the install or build runs could push with a write token, so only the job that runs none of it has one
  test("publishes only after a version change, with the write token, running none of the project's code", () => {
    const job = jobOf('release-dist', 'publish');

    expect(job.if).toBe("${{ needs.build.outputs.skip == 'false' }}");
    expect(job.permissions).toEqual({ contents: 'write', actions: 'write' });
    expect(job.steps[0].with).toMatchObject({
      ref: '${{ github.event.pull_request.head.sha }}',
      'persist-credentials': false
    });
    expect(runsProjectCode(job)).toEqual([]);
  });

  // The artifact is the build's, so the publish job takes no more from it than the release scripts dist tracks
  test('commits only the files dist tracks from the artifact, each a plain file', () => {
    const { steps } = jobOf('release-dist', 'publish');
    const names = steps.map(({ name }) => name);
    const check = runOf(steps, 'Check the artifact holds only the release scripts');

    expect(steps.find(({ uses }) => uses?.startsWith('actions/download-artifact@'))?.with).toMatchObject({
      name: 'release-dist'
    });
    expect(check).toContain("git ls-files 'dist/*.js'");
    expect(check).toContain("find . -mindepth 1 -printf '%P %y\\n'");
    expect(check).toContain('if [ -z "$expected" ] || [ "$found" != "$expected" ]; then');
    expect(check).toContain('exit 1');
    expect(names.indexOf('Commit dist, push it to the branch and start CI on it')).toBeGreaterThan(
      names.indexOf('Check the artifact holds only the release scripts')
    );
  });

  // A push with this token starts no run without approval, so main's required ci check runs on the dist commit only
  // through a dispatch; and committing only when dist changed keeps a later push from adding an empty commit
  test('commits dist only when it changed, pushes it to the branch and starts CI on it', () => {
    const { steps } = jobOf('release-dist', 'publish');
    const pushStep = 'Commit dist, push it to the branch and start CI on it';
    const push = runOf(steps, pushStep);

    expect(push).toContain('git diff --cached --quiet');
    expect(push).toContain('"HEAD:refs/heads/$HEAD_REF"');
    expect(push).toContain('gh workflow run ci.yml --ref "$HEAD_REF"');
    // Never forced: it fails if the branch moved on
    expect(push.split('\n').filter((line) => line.includes('git push'))).toEqual([
      'git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" "HEAD:refs/heads/$HEAD_REF"'
    ]);
    expect(tokenSteps(steps)).toEqual([pushStep]);
  });

  // The pull request's own workflows start on the bot's commit too, held for approval; the dispatch already runs CI
  test('deletes the runs its push leaves held for approval, after the dispatch, never failing on them', () => {
    const push = runOf(jobOf('release-dist', 'publish').steps, 'Commit dist, push it to the branch and start CI on it');

    expect(push).toContain('-f head_sha="$NEW_SHA"');
    expect(push).toContain('-f status=action_required --jq \'.workflow_runs[].id\')" || HELD=""');
    expect(push).toContain(
      'gh run delete "$RUN_ID" --repo "$GITHUB_REPOSITORY" || echo "::warning::The held run $RUN_ID wasn\'t deleted"'
    );
    expect(push.indexOf('gh run delete')).toBeGreaterThan(push.indexOf('gh workflow run ci.yml'));
  });
});

describe('.github/workflows/cleanup.yml', () => {
  // Weekly, and by hand
  test('runs on a schedule and by dispatch, one at a time', () => {
    const { on, concurrency } = workflow('cleanup');

    expect(Object.keys(on).toSorted()).toEqual(['schedule', 'workflow_dispatch']);
    expect(on.schedule).toHaveLength(1);
    expect(concurrency).toEqual({ group: '${{ github.workflow }}', 'cancel-in-progress': false });
  });

  // It can delete runs and nothing else, and never one still going. Of the runs held for approval only the release
  // bot's go (the dist commit's, already covered): a contributor's waits for its pull request to close (held-runs.yml)
  test("deletes the release bot's held runs and other finished runs older than two weeks, with write access to Actions only", () => {
    const job = onlyJob('cleanup');
    const held = runOf(job.steps, "Delete the release bot's held runs");
    const old = runOf(job.steps, 'Delete finished runs older than two weeks');

    expect(job.permissions).toEqual({ actions: 'write' });
    expect(held).toContain("--status action_required --user 'github-actions[bot]'");
    expect(held).toContain('gh run delete "$RUN_ID"');
    expect(old).toContain("date -u -d '14 days ago'");
    expect(old).toContain('--status completed');
    expect(old).toContain('select(.conclusion != \\"action_required\\" and (.createdAt | fromdateiso8601) < $CUTOFF)');
    expect(old).toContain('gh run delete "$RUN_ID"');
  });
});

describe('.github/workflows/held-runs.yml', () => {
  // Closed or merged; reopened, ci.yml's own trigger starts a new run
  test('runs when a pull request closes, from the base repository', () => {
    expect(workflow('held-runs').on).toEqual({ pull_request_target: { types: ['closed'] } });
  });

  // pull_request_target has the repository's token, so it never checks out or runs the pull request's code, and the
  // branch name a fork chose reaches the script only through env
  test("deletes only that pull request's held runs, running none of its code, with write access to Actions only", () => {
    const job = onlyJob('held-runs');
    const run = runOf(job.steps, "Delete the pull request's held runs");

    expect(job.permissions).toEqual({ actions: 'write' });
    expect(job.steps.map(({ uses }) => uses).filter(Boolean)).toEqual([]);
    expect(run).toContain('status=action_required');
    expect(run).toContain('select(.head_branch == env.HEAD_REF and .head_repository.full_name == env.HEAD_REPO)');
    expect(run).toContain('gh run delete "$RUN_ID"');
    expect(run).not.toContain('${{');
  });
});

describe('.github/workflows/auto-release.yml', () => {
  // A release is a version bump, so other pushes to main don't start it
  test('runs on a push to main that changes package.json', () => {
    expect(workflow('auto-release').on).toEqual({ push: { branches: ['main'], paths: ['package.json'] } });
  });

  test('checks and builds, then releases what was built', () => {
    expect(Object.keys(workflow('auto-release').jobs)).toEqual(['check', 'release']);
    expect(jobOf('auto-release', 'release').needs).toBe('check');
  });

  test('builds the release scripts with a read-only token, keeping them and their notes as an artifact', () => {
    const job = jobOf('auto-release', 'check');
    const names = job.steps.map(({ name }) => name);
    const gather = runOf(job.steps, 'Gather the release scripts and notes');
    const upload = job.steps.find(({ uses }) => uses?.startsWith('actions/upload-artifact@'));

    expect(job.permissions).toEqual({ contents: 'read' });
    expect(tokenSteps(job.steps)).toEqual([]);
    expect(pnpmRuns(job.steps)).toEqual(['pnpm run build:release']);
    expect(names.indexOf('Gather the release scripts and notes')).toBeGreaterThan(names.indexOf('Build'));
    expect(gather).toContain('CHANGELOG.md');
    expect(gather).toContain('exit 1');
    expect(upload?.with).toEqual({
      name: 'release',
      path: '${{ runner.temp }}/release/',
      'if-no-files-found': 'error',
      'retention-days': 1
    });
  });

  // dist/ on main is what installs from before GitHub Releases update from, so the release that last wrote it must
  // be exactly its build; later releases leave dist alone
  test('checks dist matches the build only when dist claims this version', () => {
    const { steps } = jobOf('auto-release', 'check');
    const names = steps.map(({ name }) => name);
    const check = runOf(steps, 'Check dist matches the build, when dist is this version');

    expect(names.indexOf('Check dist matches the build, when dist is this version')).toBeGreaterThan(
      names.indexOf('Build')
    );
    expect(check).toContain(
      "git show HEAD:dist/trueachievements-extras.user.js | grep -q 'releases/latest/download/'; then"
    );
    expect(check).toContain('exit 1');
    expect(check).toContain("git diff --quiet -- 'dist/*.js'");
  });

  // main's ruleset refuses this token's pushes, so the release makes the tag; a tag isn't under the ruleset
  test("releases with the write token, running none of the project's code", () => {
    const job = jobOf('auto-release', 'release');

    expect(job.if).toBe("${{ needs.check.outputs.skip == 'false' }}");
    expect(job.permissions).toEqual({ contents: 'write' });
    expect(job.steps.map(({ uses }) => uses?.split('@')[0]).filter(Boolean)).toEqual(['actions/download-artifact']);
    expect(runsProjectCode(job)).toEqual([]);
    expect(tokenSteps(job.steps)).toEqual(['Create the release on the commit checked', 'Check the release is Latest']);
  });

  test('releases only the two scripts and the notes, each a plain file', () => {
    const check = runOf(
      jobOf('auto-release', 'release').steps,
      'Check the artifact holds only the release scripts and notes'
    );

    expect(check).toContain('notes.md trueachievements-extras.min.user.js trueachievements-extras.user.js');
    expect(check).toContain("find . -mindepth 1 -printf '%P %y\\n'");
    expect(check).toContain('exit 1');
  });

  // releases/latest/download is where installs update from, so each release is marked Latest, on the commit built
  test('creates the release on the commit checked, marked Latest, with the notes the check job wrote', () => {
    const create = runOf(jobOf('auto-release', 'release').steps, 'Create the release on the commit checked');

    expect(create).toContain('gh release create "$PACKAGE_VERSION"');
    expect(create).toContain('--target "$GITHUB_SHA"');
    expect(create).toContain('--notes-file "$ARTIFACT/notes.md"');
    // --latest on its own: --latest=false would leave installs where they are
    expect(create).toMatch(/--latest(?![=\w-])/u);
    expect(create).not.toContain('${{');
  });

  // Installs update from releases/latest, so a release GitHub didn't make Latest fails the run
  test('fails unless the new release is Latest, checked last', () => {
    const { steps } = jobOf('auto-release', 'release');
    const check = runOf(steps, 'Check the release is Latest');

    expect(steps.at(-1)?.name).toBe('Check the release is Latest');
    expect(check).toContain('gh api "repos/$GITHUB_REPOSITORY/releases/latest" --jq .tag_name');
    expect(check).toContain('if [ "$LATEST" != "$PACKAGE_VERSION" ]; then');
    expect(check).toContain('exit 1');
  });

  // The release's notes are its version's section, and the settings menu shows the first one, so a version bump
  // without its section, or with an empty one, fails here, on the pull request, rather than after the merge
  test("opens CHANGELOG.md with package.json's version and its notes", () => {
    const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as { version: string };
    const [, firstHeading, notes] =
      /^## (.+)$([\s\S]*?)(?=^## |(?![\s\S]))/mu.exec(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8')) ?? [];

    expect(firstHeading).toBe(version);
    expect(notes).toMatch(/^- \S/mu);
  });
});
