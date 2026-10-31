# Review lanes

## The shared brief

Use this as each lane's `background`, with `<mode>` set to change, full or targeted:

> This is a <mode> review of the TrueAchievements Extra repo (Preact/TypeScript Tampermonkey userscript, rspack build, Vitest). The maintainer has every change reviewed (a change review starts on its own when a piece of work finishes), and asks for full and targeted reviews. There may be little to find, but double-check everything. The review is split into lanes, each its own session sharing this checkout. Every lane is READ-ONLY: change nothing except your own findings file. No commits, no `git stash`, no branch switching, never `pnpm run build:release`. Running specs, `pnpm run lint` and `pnpm vitest bench` is fine. No lane builds: `build:dev` replaces the dev script the user tests with, and lanes building at once overwrite each other's output. When the perf or build lane runs, the prod build's sizes and times, before and after, are in this brief. No live-site checks: when only a live check would settle something, say so in the finding. A second agent verifies every finding, so be concrete and honest about confidence.

Each lane's `prompt` has six parts:

1. Load the project skill `trueachievements-extra` and read the files named for the lane, plus `.claude/skills/repo-review/decisions.md`. Don't raise anything already settled there, unless the code has changed in a way that undoes the reason (then say what changed). Don't read the project skill's `history.md`: it's long and mostly stories, and the verifier checks each finding against it. The skills lane is the exception, as `history.md` is in its area.
2. Give the lane's scope, by mode:
   - **Change:** the changed files in the lane's area (perf, tests and security get every changed file; accessibility gets the changed components, stylesheets and code that adds to the page's markup; other-features also gets any changed `*Settings.tsx` panel from another group, for the `settingRowClasses` check only, raising nothing else in it). Read the code around them where needed (callers, the spec beside them), but raise only what the change brought in or touched.
   - **Full:** the lane's area. Its files in `git diff --stat <last full review commit>` (the command in `.claude/skills/repo-review/last-full-review.md`) and in `git ls-files --others --exclude-standard` (new files the diff doesn't list) get the full pass; the rest gets a lighter pass for bugs and rule breaks only. When the command prints nothing, the whole area gets the full pass.
   - **Targeted:** what the maintainer named, for the full pass.
3. Set the bar: raise only bugs, real risks, dead code and files, rule breaks, duplicated logic, and changes with a clear payoff. Not raised: rewording code that reads fine, renames by taste, "could also be done as…", or moving code between equally good places. "Nothing worth raising" is a good result.
4. Say what to look for: the lane's own list (below). If something conflicts with a skill rule, or a rule looks wrong, raise it as a question. Never raise the emoji list or compress-json.
5. Give the findings file, `dist/refactoring-lanes/<review>/<lane>.md` (the review's folder: SKILL.md, step 1). One entry per finding, ranked most important first: id (the lane's name and a number, such as `games-3`, so the id says which lane raised it), `file:line`, category, what, why, suggested change, whether it changes anything visible, and confidence (high/medium/low).
6. End with a one-line summary: the count by category.

## What the area lanes look for

Every area lane (core, page-ui, games, other-features, staff) looks for: bugs; refactors and restructures; code in the wrong folder (by the folder rule, with its listed exceptions); duplicated code; dead code and unused exports, methods and files; needless complexity; comments that break the comments rule, or that could just go; code that isn't Preact-idiomatic yet (imperative DOM building, manual listeners that could be components, hooks or signals); places where a library or platform API would do better; hand-written HTML in specs where real fixtures are required.

**And the edge cases,** for every function and component in scope. What happens when:
- the element it needs isn't on the page yet, or never shows up;
- a list is empty, or has one item;
- the user is signed out;
- its setting is off, or is switched off while the page is open;
- a fetched page fails, or comes back in a shape it doesn't expect;
- it runs twice (the page's own scripts re-render, or the feature starts again).

## The lanes

**Area lanes:** every source folder is in exactly one area lane's area, apart from `test/`, which is the tests lane's. Other-features also compares every `*Settings.tsx` panel, wherever it lives, without taking the panels over: each stays in its own lane's area.

| Lane | Area | Also read |
|---|---|---|
| core | `src/lib`, `src/site`, `src/storage`, `src/fetch` | components.md |
| page-ui | `src/page` (with `sticky/`), `src/ui`, `src/scss`, `src/dev`, `src/resources`, `src/maintenance.ts`, `src/index.ts` (with their specs), `src/typings.d.ts`, `src/features/index.ts`, `src/features/settings-tabs.tsx` | components.md |
| games | `src/features/game/**`, `src/features/games-list/**`, `src/features/gamer/**` | components.md, writing-specs.md |
| other-features | `src/features/forum/**`, `news/**`, `all-pages/**` (with the settings menu), plus, for comparison only, every `*Settings.tsx` panel compared for consistent `settingRowClasses` (a toggle whose sub-settings show when checked uses `noBorderWhenChecked`, the rows it reveals `underToggle`; the lines themselves are the stylesheet's, checked by `settings-menu-lines.spec.tsx`) | components.md, writing-specs.md |
| staff | `src/features/staff/walkthrough/**` | components.md, staff-pages.md, open-items.md |
| build | `build/**`, `package.json` (scripts; unused, duplicated or replaceable dependencies; any package step 2 left behind or held back without a reason in decisions.md), `pnpm-workspace.yaml`, `tsconfig.json`, `vitest*.mts`, `.oxlintrc.json`, `.oxfmtrc.json`, `.github/**` apart from `ISSUE_TEMPLATE`, `.husky/**`, `.vscode/**`, `.gitattributes`, `.gitignore`, `.nvmrc`. Also: build speed and size (from the before-and-after figures in the brief), rspack settings not used yet, lint rules missing or redundant. Stay within the CI rule (runs allowed if cleaned up, each kept quick) | setup.md, build-and-ci.md, shell.md |
| skills | `.claude/skills/**/*.md` (read `local.md` for context only, never quote account details from it), `.claude/settings.json`, `CLAUDE.md`, `README.md`, `FEATURE-DOCUMENTATION.md`, `CHANGELOG.md`, `CREDITS.md`, `.github/ISSUE_TEMPLATE/*`. Check every path, symbol, script and setting named still exists (grep each). Look for: duplicated rules; files to split or merge; content in the wrong file by SKILL.md's "Where new findings go"; dates outside history.md; overlong wording; weak skill descriptions; rules in conflict with each other or the code; docs out of step with `src/features` and `src/storage/settings-tree.ts` | all of the project skill |

**Concern lanes:** each covers the whole repo for one concern, with its own way of checking.

| Lane | Looks for | How it checks | Also read |
|---|---|---|---|
| perf | Work added at page start; observers, listeners, timers and subscriptions never cleaned up; repeated DOM queries or layout reads in a loop; fetches that could be cached or shared; re-renders a signal or memo would avoid; bundle growth | Reads the code; compares the prod build's sizes before and after (given in the brief); a full review also runs `pnpm vitest bench`. Timings on the live page are a live check: say which one would settle it | components.md, build-and-ci.md, writing-specs.md ("Measuring before and after") |
| tests | Specs that repeat another's checks; specs that only check a mock; specs that would still pass with the code broken; risky code with no spec; test setup (`test/`) that's duplicated, dead or wrong | Reads specs against the code; in a full review, a sample of `pnpm test:mutate` on risky code (shell.md, "The mutation check") | writing-specs.md, test-helpers.md, testing.md, shell.md |
| security | HTML from a fetched page, a stored value or the URL reaching the DOM without escaping (`innerHTML`, `dangerouslySetInnerHTML`, `insertAdjacentHTML`); `@grant` and `@connect` wider than the code uses; stored or fetched data trusted without a check; anything that sends the user's data off the site; workflows given more `permissions` than they use, secrets reachable from pull request runs, or triggers that run a pull request's code with the repo's rights (`pull_request_target`, `workflow_run`); new or replaced dependencies (who publishes them, install scripts, a lockfile change with no `package.json` change); `.claude/settings.json` permissions widened | Reads the code, `build/metadata.ts`, the workflows and the actions they use (`.github/actions/`), and `.claude/settings.json`; greps for each risky API and follows where its input comes from; for a dependency change, diffs `pnpm-lock.yaml` and for each new or replaced package runs `pnpm view <package>@<version> maintainers repository.url scripts.preinstall scripts.install scripts.postinstall` (who publishes it, and what it runs on install) and `pnpm view <package> time --json | grep '"<version>"'` (when that version was published; a version's dots can't go in a `pnpm view` field path) | components.md, build-and-ci.md |
| accessibility | Controls that a keyboard can't reach or use; icon-only buttons with no label; tabs, accordions, menus and dialogs without their roles and states (`aria-selected`, `aria-expanded`, `aria-controls`); focus lost or trapped when something opens, closes or re-renders; form fields without labels; colour as the only signal; text contrast in either theme; motion without a `prefers-reduced-motion` fallback | Reads components and stylesheets; works out contrast from the theme colours. A look that only the live page settles goes in as a finding with the live check named. Fixes usually change something visible, so most findings are NEEDS-MAINTAINER | components.md, site-looks.md, site-quirks.md |
| ponytail | Full reviews only: what to delete, merge or split, across the whole repo. Some apparent bloat is the maintainer's rulings (shared files kept with one user, the Font Awesome icons, the emoji list, compress-json): list a conflict with a ruling as a rule question rather than dropping it | The `ponytail-audit` skill, told to skip what the other concern lanes cover (performance, tests, security, accessibility). It's installed per developer, not in this repo: where it isn't available, work through "Looks for" by hand (unused files and exports, code that does the same job twice, files or functions doing two jobs that should be split), and say at the top of the findings file that the skill wasn't used | the project skill's SKILL.md (the folder rule and the rulings on what stays shared) |

## Models

Each session's model and effort, unless the maintainer asks for others for a review (SKILL.md, step 3). Depth goes where bugs are found; the cheaper model where the work is reading and comparing.

| Sessions | Model and effort |
|---|---|
| core, page-ui, games, other-features, staff, perf, tests, security, accessibility | Opus, high |
| build, skills, ponytail | Sonnet, high |
| A group's verifier, and a small change review's one session | Opus, high, if any of its lanes is; otherwise Sonnet |
| The update, fix-batch and close-out verifiers | Opus, high, for code; Sonnet for docs, config and packages only |

## Verification groups

Lanes are verified a group at a time (SKILL.md, step 4): one verifier per group, started once all its lanes have finished. Each group's lanes look at the same code, so the verifier reads it once.

| Group | Lanes |
|---|---|
| shared | core, page-ui, perf |
| features | games, other-features, staff |
| repo | build, security, skills |
| across | tests, accessibility, ponytail |

A lane added later joins the group whose code it looks at most.

Categories: bug, edge-case, refactor, cleanup, comment, preact, library, build, package, ci, perf, leak, security, accessibility, test-infra, test-gap, test-duplicate, test-weak, consistency, rule-question; for the skills lane: stale, wrong, duplicate, split, merge, reword, misplaced, docs.
