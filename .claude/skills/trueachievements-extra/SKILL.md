---
name: trueachievements-extra
description: TrueAchievements Extra (Preact/TypeScript Tampermonkey userscript) - how to work on this repo. Use at the start of every session here; when running node, pnpm, vitest, oxlint or rspack; adding or renaming a setting, stored value or feature (migrations, FEATURE-DOCUMENTATION, CHANGELOG); writing components or specs; a failing install or spec ("Worker exited unexpectedly", "GM_getValue is not defined", "[object Object]" rendered); CI or release changes; finding the page or folder for a feature; the developer's account and machine notes (local.md); and any live check on trueachievements.com or a guide site (pages, fixtures, theme, Preact DevTools states, staff walkthrough pages).
---

# TrueAchievements Extra: working on this repo as an agent

**First, read [local.md](local.md) if it exists.** It's git-ignored and holds what depends on the developer you're working with:
- their TrueAchievements account (staff access, walkthroughs they can open or manage, edit page ids, threads they own);
- their site preferences (theme and the settings to put back after a check), and the games they've played;
- their machine (repo path, how Node is installed, their Chrome and Tampermonkey setup, file-handle tools).

The files here point to it wherever that matters. **If it doesn't exist,** offer to create it now, before the task ([creating-local.md](creating-local.md)); if the user would rather not, ask only for what the task needs. Never guess another developer's account facts.

In these files, "the user" is whoever you're working with; "the maintainer" is the repo's owner, whose rulings bind everyone working on it.

Start by checking `node -v` (expect `v26.13.1`) and `pnpm -v` (expect `12.23.0`). If either is wrong or missing, `node_modules` isn't installed, or an install fails, read [setup.md](setup.md) first.

## The other files

More detail lives next to this file. Read the one you need.

**Start**
- [local.md](local.md) (git-ignored; template [local.example.md](local.example.md); filling it in: [creating-local.md](creating-local.md)): this developer's account, site preferences and machine.
- [setup.md](setup.md): Node and pnpm (the pinned versions, the desktop app's private `AppData`), installing and adding dependencies, failed installs, and when to use the user's own terminal.
- [open-items.md](open-items.md): **everything carried over from finished sessions** that's still to check or do, with what each needs, for every session. Glance at it at the start of a session; add new items there rather than in another file. Work still in progress, within a session or across sessions running now, goes in the git-ignored `refactoring.md` at the repo root instead (open-items.md, top).

**Code**
- [components.md](components.md): writing or reworking a Preact component: state (controllers for the site's markup, signals, settings), switching states live, the folder layout, conventions, and what to check live.
- [writing-specs.md](writing-specs.md): writing specs: the recipes (waits, parsing, fetched pages, storage, IndexedDB), entry specs, SCSS in specs, fixtures, settings that apply live.
- [test-helpers.md](test-helpers.md): what `@ta-x-test` and `test/mocks` give the specs (the setup, every `page` and `repo` spec): the shared helpers, matchers, lint rules for specs, isolation and the three projects, `unstubEnvs`.
- [testing.md](testing.md): debugging failing specs, test-environment gotchas (happy-dom vs Chrome, spies, shared state), stubbing fetched pages.
- [shell.md](shell.md): shell habits in full: git, line endings, refused writes, writing scripts, the mutation check, moving files, reading fixtures from a script.
- [build-and-ci.md](build-and-ci.md): the release scripts, the CI workflows and `main`'s ruleset, bundle analysis (Rsdoctor) and measuring the script's size.

**Site**
- [live-site.md](live-site.md): Claude in Chrome on trueachievements.com: opening pages, reading markup/CSS/timing, recording an issue for the maintainer (real 60 fps video, per-frame logs, stepping a slide, finding what moved the page), checking a dev build ("Checking a change live" is the build-reload-read loop), switching the site theme, capturing fixtures. Read it before any live check.
- [page-map.md](page-map.md): which page each feature runs on (example URL, URL check, folder), plus how to switch each feature's states (Preact DevTools). **Keep it up to date** when a URL check or feature folder changes.
- [staff-pages.md](staff-pages.md): the staff walkthrough pages (walkthrough team accounts only): reaching each in the state a check needs, and the staff features' states.
- [site-quirks.md](site-quirks.md): site CSS and markup gotchas found live (themes, buttons, side lists, Font Awesome subset, SVG in Preact…). Check before restyling or adding controls.
- [site-looks.md](site-looks.md): the closest site element to copy for each look we need (tabs, group headers, tabbed and titled side sections, list rows), measured in both themes, plus near-misses and measuring tips. Check it before styling a component.

**Background**
- [history.md](history.md): the stories and dates behind the rules here (why each is as it is). Not needed day to day.

## Where new findings go

Keep each file to its job. State a rule plainly where it applies; its story or date goes in history.md. **No dates in any other shared file**, not even when a site fact was seen or since when an item has been open.

| Finding | File |
|---|---|
| Account or machine facts (ids, settings, paths, incidents) | local.md, never the shared files |
| A feature's page, URL check or folder | page-map.md |
| A component's states and how to switch them | page-map.md (staff features: staff-pages.md) |
| How to reach a staff page's states | staff-pages.md |
| A spec recipe | writing-specs.md |
| A spec helper or matcher | test-helpers.md |
| A spec failure's symptom and cause | testing.md |
| A site gotcha | site-quirks.md, under its heading |
| A look to copy | site-looks.md |
| How to check something in the browser | live-site.md |
| How to write or rework a component | components.md |
| Node, pnpm and installs | setup.md |
| Build, release, CI, the bundle | build-and-ci.md |
| A shell, git or scripting habit | shell.md |
| Something still to check or do, carried over from a finished session | open-items.md (who is getting it for this account: local.md) |
| Work in progress, within a session or across running ones | `refactoring.md` at the repo root (git-ignored; open-items.md, top) |
| A maintainer's ruling | the file where it applies, stated as a rule; its date and reason in history.md |
| The story or date behind a rule | history.md |

## Where code goes (the folder rule)

- **Folders follow the site's addresses** (the maintainer's ruling): `src/features/<area>/<page>/<feature>/`, each area named after the part of the site it runs on and each page as the site names it (a game's hub tabs: `game/achievements`, `game/clips`, `game/forum`; `/a<id>` is `game/achievement`). The areas: `all-pages` (runs everywhere), `games-list` (`/games.aspx`), `game` (`/game/<name>/…`), `gamer` (`/gamer/<name>/…`), `forum` (`/forum/…`: `view-board`, `my-threads`, `view-thread`), `news` (`/news/…`), `staff/walkthrough` (`/staff/walkthrough/…`, each page named after its `.aspx`: `manage-walkthrough`, `walkthrough-page`, `edit-walkthrough-page`, and `walkthrough-preview` for both previews, `walkthroughpreview.aspx` and `walkthroughpagepreview.aspx`). A settings tab shows one or more areas (`settings-tabs.tsx`: Games is `games-list` then `game`), so a folder never needs moving when a setting moves tab. The settings tree (`storage/settings-tree.ts`) has the same shape, and each setting's storage key is its path there (`game.dlc.collapsibleGroups`), so a feature that moves folder moves its settings' keys too, with a migration.
  - **No `<page>` level** where the area is one page or runs everywhere (`all-pages/sticky-header`, `games-list`; `news` has one page, `news/sales`, the sale articles), or for a feature of several of its area's pages with its own settings group (`game/extra-guides`: the achievements, DLC and achievement pages), and a small feature may be a file in its page's folder rather than a folder (`game/achievements/collapsible-groups.ts`).
  - **A feature lives with its main page, where its setting is,** even when its work reaches other pages: the game forum's default thread links rewrite forum links on every page from `game/forum`, and Show Walkthrough Information remembers a walkthrough's thread on a game's walkthrough page from `forum/view-thread`.
  - **The settings menu is `all-pages/settings-menu`** (it runs on every page), but `src/index.ts` starts it through `settings-tabs.tsx` (`settingsMenu`), which hands it every area's panel, rather than through `all-pages/index.ts`.
- **A feature's everything sits in its folder:** `src/features/<area>/<page>/<feature>/` holds its code, components, `styles.ts`, `*.scss`, types and specs (and the `stored()` values and IndexedDB stores only it uses). Deleting the folder removes the feature's code, apart from its lines in its page's `index.ts` and `*Settings.tsx` panel (its area's, where there's no page level), in `scss/index.scss` and in `maintenance.ts`' `expiringStores` (for an IndexedDB store), its settings in `storage/settings-tree.ts` and `settings-keys.spec.ts` (with a migration dropping the stored keys), its `stored-values.spec.ts` declarations, the specs that list it, and its fixtures in `test/html`. Two features of an area sharing code use the area's `shared/` folder (`game/shared`: default status, individual progress, collapsible groups, the leaderboard link).
- **No duplicate code, even for two users:** one copy, in the area's `shared/` folder when both features are in one area, otherwise in the shared folder its subject belongs to (below), or exported from the owning feature's `index.ts` (the sticky header reads the settings menu's `waitForSiteGamerPanel` and `settingsMenuOpen`).
- **The settings menu imports no feature,** as features it doesn't own import it (the sticky header, the giveaway). Each area's `index.ts` exports its `<Area>Settings` panel (`GameSettings`, `GamesListSettings`), and `src/features/settings-tabs.tsx` lists the tabs (id, label, panel) for the menu, composing a tab's panel when it shows several areas. The `game` area also hands over `settingsAppliedOnArrival` for the reload notice. A new area adds its panel there; anything else the menu needs from a feature is passed in the same way.
  - What's shared is code that is genuinely the same (a hook, a lookup, a list); a feature's own state and flow stay in its file, not behind a generic layer over two features' logic.
  - When two features only look alike, keep them apart and say why; if unsure which side a case is on, ask.
- **The shared folders, by subject** (each one alias):
  - `lib/` (`@ta-x-lib`): pure, knows nothing of the site or the page: strings and `classNames`, promises (`allConcurrently`, `yieldToPage`, `until`), durations (`durationMs`, `fromNow`), `callAll` (run every undo in a list), `timed` (a dev-build performance measure around some work; live-site.md, "Timing a change live"), the logger.
  - `site/` (`@ta-x-site`): facts about TrueAchievements and how to read it: URL checks (`urls.ts`), the postback parser, site images, cookies. It reads the page's address and cookies, so it isn't pure.
  - `storage/` (`@ta-x-storage`): what we keep: `setting()`, the settings tree (`settings-tree.ts`), effective settings, `stored()`, the migrations, IndexedDB.
  - `fetch/` (`@ta-x-fetch`): getting pages (`fetchOk`, `memoizeFetch`, the fetch store) and watching the site's own requests (HTTP intercept).
  - `page/` (`@ta-x-page`): working with the live page: the waits (`whenParsed`, `bodyReady`, `waitForElement`), `isFreshArrival` (a fresh visit, not a post back or reload), the observers, `mount`, page scripts, `triggerEvent`, and `sticky/` (the sticky helper, `stickUnderHeader`, the slide classes and `stickyAnimations` in `slide-classes.ts`, their stylesheet `_slide-animations.scss`, and the `slide-under-sticky-header` mixin in `_sticky-under-header.scss`). It may render Preact (`mount`) but never imports `ui`.
  - `ui/` (`@ta-x-ui`): components more than one feature uses, the icons, the root and hide classes, and the stylesheet's start-up (`stylesheet.ts`: adds our sheet and the root class); each component's stylesheet is a partial beside it (`_toast.scss`).
  - `scss/`: base, variables, and `index.scss`, which lists every stylesheet (components', then features') in cascade order.
- **Code only one feature uses** lives in that feature, and moves to a shared folder when a second feature needs it. A single-feature rule, variable or helper in `site/`, `page/` or `scss/` belongs in its feature. **These stay shared with one user** (the maintainer's rulings):
  - pure helpers in `lib/`;
  - the icons in `ui/icons`: every Font Awesome wrapper lives there, even one only one feature uses (hand-drawn icons, the guide sites' logos, and icons copied from a project we don't install, such as TinyMCE 6's select-all icon, stay in their feature; the logos and the copied icons are credited in CREDITS.md); never copy an icon's definition into the code to drop a package (the maintainer keeps control of their versions);
  - `ListSetting` and `ListSettingItem` in `ui/settings`;
  - every URL check, in `site/urls.ts`;
  - `site/sentences.ts`;
  - `controllerButtonStaticFolder` in `site/images.ts`;
  - `page/intersection-observer.ts` (a twin of the mutation and resize services);
  - `page/sticky/` (the header's slide and the elements stuck under it are one mechanism).

  Ask before moving any other single-user file out of a shared folder.
- **Imports go one way:** `lib` ← `site` ← `storage` ← `fetch` ← `page` ← `ui` ← `features` ← `src/index.ts`. A folder never imports one to its right, nor its own barrel (inside a folder, files import each other by relative path). `.oxlintrc.json` enforces both, one override per folder.
- **Beside the chain:** `src/maintenance.ts` (the daily clean-ups, at the `src/index.ts` end: it may import any folder); `src/claim-page.ts` (the first copy of the script on a page marks it, and later ones (the dev script, the two release scripts) stand down; the same end); `src/dev/` (dev builds only: the DevTools hook, `preact/debug`, the signal log (`@preact/signals-debug`), debug logging; imports `lib` only, and no lint override checks that); `src/resources/` (the favicons the header links to).
- **From outside a folder, import through its alias,** not past it into a file (`@ta-x-page`, not `../page/wait`). A spec spies on what callers import: through a barrel for callers outside the folder, on the file itself for callers inside it (testing.md).
  - **The exception:** test setup (`test/mocks`) and repo checks (`test/repo`) may import one feature file directly, by path: the features barrel would load every feature, and moving the file would take the feature's own state out of it (`test/mocks/page.ts` resets the settings menu's `settings-menu-open`; `custom-properties.spec.ts` reads a staff feature's `styles`). `src/maintenance.spec.ts` may too, for a feature's store, to check what maintenance did to it (it reads `importedGuides`): exporting a feature's own store through the barrels for one spec would let every feature reach it.
- **`test/`, by job:**
  - `support/`: the helpers specs use (`@ta-x-test` is `test/index.ts`, which re-exports `support/` only; `support/timers.ts` also has its own alias, `@ta-x-test-timers`, for the `pure` specs, as it imports nothing from `src`);
  - `mocks/`: the setup Vitest runs for every `page` and `repo` spec;
  - `plugins/`: the Vitest transforms;
  - `repo/`: the specs that check the repo rather than `src` (project structure, spec style, workflows, grants, state reset between tests, env stubs, the markdown loader). A repo check that reads several folders' code lives here too (`custom-properties.spec.ts`: the custom property names across `page`, a staff feature and the SCSS);
  - `tools/`: `pnpm test:mutate` and `pnpm fixture:condense`;
  - `html/`: the fixtures.

## Commands

| Task          | Command |
| ------------- | ------- |
| Tests (some)  | `pnpm vitest run <files>` (Vitest uses `vitest.config.mts` by default) |
| Tests (all)   | `pnpm vitest run` (`isolate: false`, test-helpers.md) |
| Tests (group) | `pnpm vitest run --project pure` (`lib` and `site` in plain Node), `--project page` (everything with the page and Tampermonkey mocks), `--project repo` (`test/repo`: the repo checks) |
| Benchmark     | `pnpm vitest bench <filter> --reporter=default` (only `*.bench.ts` files, which plain `vitest run` ignores, in the `page` project only; the reporter prints the figures in an agent shell; [writing-specs.md](writing-specs.md) → "Measuring before and after") |
| Lint          | `pnpm run lint`: what the husky pre-commit hook and CI run. The oxfmt format check (TypeScript and SCSS), then oxlint, **which type-checks too** (`.oxlintrc.json` `options.typeAware` and `typeCheck`, through `tsrs`: type-aware rules such as `no-floating-promises`, and TypeScript's own errors). `pnpm run fix` formats, then fixes what oxlint can |
| Type check    | `pnpm run lint` does it (all of `src`, `test`, `build` and the `.mts` configs); there's no separate script. `tsrs` is the only TypeScript here: no `typescript` package, and VS Code uses tsrs's language server (`.vscode/settings.json`, the TypeScript 7 extension) through `node_modules/.tsrs-tsdk`, a link `postinstall` makes on every platform (`build/link-editor-tsdk.ts`; setup.md). For the type errors alone, `pnpm exec tsrs -p tsconfig.json` |
| Dev build     | `pnpm run build:dev`, written to the untracked `dist/trueachievements-extras.debug.js` and `.dev.user.js` (inline source maps, `eval-cheap-module-source-map`) |
| Prod build    | `pnpm run build:prod` / `pnpm run build:prod-min` (`--config-name prod` / `prod-min`), `pnpm run build:prod-all` for both in one process, or `pnpm run build` for dev plus `build:prod-all`; written to the untracked `dist/local/` |
| Mutation check | `pnpm test:mutate <experiments.json> [id]` ([shell.md](shell.md)) |
| CI specs      | `pnpm run test:github` (what CI runs: `vitest run` with lcov coverage in `dist/coverage/lcov.info` and a JUnit report in `dist/coverage/test-report.junit.xml`, the two files CI uploads to Codecov (coverage, and Test Analytics); its reporters are named, so `github-actions` is listed with them, as Vitest adds it itself only when none are) |
| Condense a fixture | `pnpm run fixture:condense` (live-site.md, "Capturing a fixture") |
| Watch, Vitest UI, Rsdoctor | `pnpm start` (`build:dev` with `--watch`), `pnpm test:reports`, `pnpm run analyse` (`prod-min`, the minified build, with `--env analyse`; [build-and-ci.md](build-and-ci.md)): only when asked, below |

- **Always use `pnpm run build:dev` for dev builds.** The dev script `@require`s that `debug.js` by a `file://` path (setup.md, section 0), so a reload runs your build, with source maps in the browser's dev tools. If the user already has `pnpm start` (watch mode) running, it rebuilds on every save: don't build alongside it.
- **Never run `pnpm run build:release` locally:** it writes the tracked release scripts in `dist/`, which only CI commits (the release build, on the version bump's pull request); `git checkout -- dist` undoes it ([build-and-ci.md](build-and-ci.md)).
- **A change to the userscript header** (`build/metadata.ts`: `@match`, `@grant`, any `@connect`) **needs the user to reinstall the dev script** from `dist/trueachievements-extras.dev.user.js`: Tampermonkey reads the header from the installed script. Ask them; don't change their Tampermonkey setup yourself.
- **Don't run `pnpm start`, `pnpm test:reports` (the Vitest UI) or `pnpm run analyse` unless the user asks.** The Vitest UI needs the tokened "UI started at …?token=…" address it prints (the plain one answers 403), writes its report to `dist/html`, and runs in watch mode: stop its `node` process too when done.

## Full check in one command (Bash)

```bash
cd <repo> && {
  node -v
  echo "== vitest"; pnpm vitest run 2>&1 | grep -E "FAIL|Test Files|Tests " | sort -u
  echo "== lint"; pnpm run lint 2>&1 | grep -iE "warning|error|format issues|exit code [1-9]"
  echo "== build"; pnpm run build:dev 2>&1 | tail -2
}
```

- The braces keep every step behind the `cd`, so a failed `cd` runs none of them; inside, the `;`s let lint and the build run after a failing spec.
- Colour output is off in agent shells (`FORCE_COLOR=0` / `NO_COLOR=1` in `.claude/settings.json` `env`). Tick/cross symbols come out mangled on Windows, so grep for `Test Files|Tests |FAIL`.
- **Formatting is enforced:** a badly formatted file fails `pnpm run lint` and the pre-commit hook. `pnpm run fix` (or `pnpm exec oxfmt --write <files>`) reformats. The `test/html` fixtures are excluded (`.oxfmtrc.json` `ignorePatterns`), as they keep the site's own markup.

## Shell habits

The essentials (the rest, with scripts, refused writes, the mutation check and moving files, is in [shell.md](shell.md)):

- **Start every Bash command with `cd <repo> &&`** (the repo's Git Bash path, in local.md) or use absolute paths.
- **Chain dependent steps with `&&`**, so a failed step doesn't run the next one against the wrong files.
- **Never `git stash`**, not even one path; `git mv` / `git rm` stage their changes; commit only when the user says to (asked after each change review or verification pass: shell.md).
- **Scripts with quotes, backticks or regexes go in a file** in the scratchpad (`node <file>`), never `node -e` or a heredoc.
- **Back up `src` and `test` to the scratchpad** before a script edits many files: much of the work is untracked.

## Baseline: everything is clean

CI runs lint (which includes the type check) and the specs, then the prod build (`ci.yml`, [build-and-ci.md](build-and-ci.md)). Locally, any failure from these is a regression:

- **Tests:** all pass. Compare against the count from a run on the code before your change, not a number written down here.
- **Type check:** zero errors from lint's type check (`tsrs`), which covers `src`, `test`, `build` and the `.mts` configs, with `"strict": true` (nulls included, in specs too: writing-specs.md, "Elements a spec needs"). One `tsconfig.json`, `noEmit`, with the spec globals (`vitest/globals`) everywhere; rspack reads it for path aliases too.
- **Lint:** `oxlint --deny-warnings`, so any warning fails lint, the pre-commit hook and CI (usually an unused import left by a deleted test): fix it. `console` is allowed in specs, `build/` and `test/tools/` (`.oxlintrc.json` overrides).
- **`unsafeWindow` is banned by lint** (`no-restricted-globals` and `no-restricted-properties`), apart from `src/dev/devtools-hook.ts`, the Preact DevTools hook in dev builds (the maintainer's one exception: an extension's hook, not a site global; don't widen it). Never add another override or a disable comment for it, and never suggest `unsafeWindow` for site globals, even as an option. `test/repo/userscript-grants.spec.ts` keeps it out of the release metadata's grants. Reach site globals through markup instead (`href="javascript:Postback(...)"`; components.md).

## Rules for any agent on this repo (the maintainer's)

- **Verify live, don't assume.** Don't conclude anything about the site from one quick look. Check again once the page has loaded, on the page where the feature really runs, or move the tab to a page that shows it. Live checks follow [live-site.md](live-site.md).
- **A live check covers both themes:** switch the theme yourself and put the user's back (live-site.md → "Switching the site theme").
- **Check signed out in the test browser,** never by signing the user out: a second browser with our dev script, never signed in (live-site.md → "Opening a page"; local.md names it).
- **Check every place a change reaches,** not just the main one: list every user of what changed (grep the component or function) and open each one's page (a shared `TabBar` means the settings menu, Extra Guides **and** the emoji picker). If one can't be reached, ask the user to open it; never call a skipped one fine.
- **Specs of anything that reads or changes the site's markup use real captured markup** (`test/html/…`; [live-site.md](live-site.md) → "Capturing a fixture"), never hand-written HTML. Specs of our generic page helpers (`src/page`) may build the few elements they need.
- **A spec that proves a fix fails without it, through `pnpm test:mutate`** ([shell.md](shell.md) → "The mutation check"): the break is made in memory, so nothing in the repo is written. Never a script that edits a source file and puts it back: a refused write can leave the file broken.
- **Every state can be switched live in a dev build** with Preact DevTools, so state a component can show lives in the component (components.md → "Every state checkable live"). **No dev console commands.**
- **Comments give the reason only, in words,** in `src` and in specs alike. No measurements of behaviour (timings, counts, percentages, before/after figures), nor configured values such as a timeout or a slide's duration (they go stale when the value changes); a CSS size that explains a style's value is fine ("1px taller, to match its 19px arrow icon"), and so are names and identifiers that hold a number ("Metal Gear Solid 2", "TypeScript 7", database "version 2", "0-based"). No dates, no "the user said", no bug stories, no "as the old code did", no review notes and no planning documents cited: the story behind a rule goes in history.md (if it's worth keeping), the rule where it applies. No comment that restates the code. The skill and lint messages don't cite planning documents either. Fixture capture headers (`test/html`) are the exception to the no-dates rule: they record the page and its capture date, as `pnpm fixture:condense` writes them.
- **A feature change updates the user docs in the same piece of work:** `FEATURE-DOCUMENTATION.md` (the settings menu links to it) and `CHANGELOG.md`. The documentation mirrors the settings menu (the maintainer's ruling): `#` a settings tab (the menu shows each as an accordion, from `?sections`), `##` a group named as the tab's accordion, `###` a setting, all in the menu's order, with features that have no setting last in their group. `SettingsMenu.spec.tsx` fails if the tabs, the groups or a setting's `###` (its menu label, with "(no setting)" in a heading for a feature without one) drift.
- **Every finished piece of work gets a change review,** on its own and without asking: once the full check (and any live checks) pass, load the `repo-review` skill and run its change mode over the files the work changed, then ask about committing. A review's own edits (its fixes, package updates and close-out notes) get a verification session instead, so reviews don't set each other off.
- **Ask before changing a look or behaviour that's visible.** A task or review item calling one a bug or leftover is a guess (several "bugs" were intended: the tab bars' colours, the sticky start): say what will look or act differently, with the before and after, and confirm with the maintainer first, unless the item records the maintainer's own word. Record the answer with the item so it isn't "fixed" again. Changes with no visible effect (redundant or overridden rules, byte-identical CSS) need no ask.
- **CI runs are allowed, as long as they're cleaned up:** standard runners are free on this public repo, so scheduled or repeat jobs and coverage thresholds are fine. Superseded runs cancel (`concurrency`), `cleanup.yml` deletes held runs and finished runs older than two weeks, and the release's dist commit runs no lint, test or build of its own. Keep each run quick: propose a new job with its cost in time ([build-and-ci.md](build-and-ci.md)).
- **Never TypeScript `any`** (no `: any`, `as any`, `any[]`): a small interface for an outside API's members the code uses, and `(...args: never[]) => unknown` for any function.
- Don't click anything that saves the user's data (posts, saves, staff actions); the user does those clicks. **The one exception: the user's site settings** (the theme, `/customize.aspx`) **may be switched for a check without asking, and must be put back** (reload to confirm; local.md records how the user keeps them).
- **Never crawl the site:** no script that fetches page after page in a loop, even read-only and spaced out; it loads someone else's site from the user's signed-in account and could look like abuse. To find a page that fits a check, search the web (`site:trueachievements.com …`) or ask the user; fetch only the few specific pages a check needs.
- **Our own settings may be changed for a check, and must be put back:** snapshot every control in the settings menu first and compare after putting them back ([live-site.md](live-site.md) → "Changing our settings for a check"). The site's own settings follow the exception above.
- **Open walkthrough edit pages yourself** for read-only checks (no need to ask), and say in the reply that you did. The site autosaves there on load and every 30 s; with nothing typed, that saves the page unchanged, which is fine. Never type or click in the editor, and leave the page once done. local.md names edit pages this developer's account can open.
