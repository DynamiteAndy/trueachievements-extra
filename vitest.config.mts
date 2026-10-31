import { defineConfig } from 'vitest/config';

import emojiJsonTransform from './test/plugins/emoji-json.ts';
import webTransform from './test/plugins/web.ts';

// The pure shared code: no page, no Tampermonkey (lib, and site's facts that don't read the page). Its specs run in
// plain Node, so one reaching for `document` or `GM_*` fails rather than quietly working.
// Apart from cookies.spec (document.cookie), achievement-status.spec (the page's status radio) and postback.spec (a
// postback's form fields), which run with the page
const pure = ['./src/lib/*.spec.ts', './src/site/!(cookies|achievement-status|postback).spec.ts'];
// Checks of the repo itself rather than of src's behaviour (its layout, config, workflows and spec style)
const repo = ['./test/repo/**/*.spec.ts'];

// The page and Tampermonkey, for every spec but the pure ones
const withPage: { environment: 'happy-dom'; setupFiles: string[] } = {
  // happy-dom's iframe page loading stays off (its default): turned on, it fetches every fixture iframe's page from
  // the internet (YouTube embeds, trueachievements.com), and fires their load events, which the editor specs check for
  environment: 'happy-dom',
  // Tampermonkey (GM_*), element, service, storage and network mocks. Modules such as @ta-x-storage read GM_* as
  // soon as they load, so specs shouldn't depend on importing @ta-x-test to get them
  setupFiles: ['./test/mocks/fresh-modules.ts', './test/mocks/setup.ts']
};

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    globals: true,
    watch: false,
    execArgv: ['--no-webstorage'],
    // Spec files share a worker's page instead of each building its own, as setting up happy-dom for every file is
    // slow. Each file still gets fresh modules (fresh-modules.ts), and setup.ts resets the page, storage and signals
    // before every test
    isolate: false,
    restoreMocks: true,
    // Coverage when turned on: by the test:github script's flags for CI (lcov, in dist/coverage/ where CI uploads it
    // to Codecov; git ignores dist/ but for the release scripts), by vitest.reports.config.mts for the UI
    coverage: {
      provider: 'v8',
      reportsDirectory: './dist/coverage',
      include: ['src/**/*.{ts,tsx}'],
      // Specs are left out by Vitest itself; these are test code or have no code to cover
      exclude: ['**/*.spec-helpers.ts', '**/*.bench.ts', '**/*.d.ts']
    },
    // Env stubs (vi.stubEnv) are undone after every test. Not unstubGlobals: the Tampermonkey mock
    // (test/mocks/tampermonkey.ts, loaded by setup.ts) stubs the GM_ APIs once, which that would undo
    // (test/repo/env-stubs.spec.ts checks both)
    unstubEnvs: true,
    // Three groups, each run on its own with `--project <name>`. Benchmarks run in `page` only: each project would
    // otherwise pick up every bench file, and `pure` has no Tampermonkey mocks to load one
    projects: [
      {
        extends: true,
        test: { name: 'pure', include: pure, environment: 'node', benchmark: { include: [] } }
      },
      {
        extends: true,
        test: {
          name: 'page',
          include: ['./src/**/*.spec.ts', './src/**/*.spec.tsx', './test/**/*.spec.ts', './test/**/*.spec.tsx'],
          exclude: [...pure, ...repo],
          ...withPage
        }
      },
      { extends: true, test: { name: 'repo', include: repo, ...withPage, benchmark: { include: [] } } }
    ]
  },
  plugins: [webTransform(), emojiJsonTransform()]
});
