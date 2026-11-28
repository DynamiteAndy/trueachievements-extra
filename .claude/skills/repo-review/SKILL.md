---
name: repo-review
description: Reviews for TrueAchievements Extra (bugs, refactors, performance, tests, security, accessibility, build, docs) in three modes, run as parallel read-only review sessions whose findings are checked by a second agent before they're raised. A change review runs on its own whenever a piece of work finishes; a full review covers the whole repo; a targeted review covers one lane, concern, folder or feature. Use when work finishes (before asking about committing), and for "review the repo in its entirety", "full review", "audit and refactor", "security review", "review the staff lane", "perf of the sticky header", "look for refactors, cleanups, moves to Preact, dead code, packages, build changes", or /repo-review.
---

# Reviews

The maintainer's standing request: every change gets reviewed, and the whole repo gets reviewed now and then, for bugs, refactors, restructures, cleanups, moves to Preact, skill cleanup (rewording, splitting), comments to remove, packages, files, methods, complexity, performance, test value, security and accessibility. Build changes and better libraries are welcome. There may be little to find, but always double-check.

**First load the project skill `trueachievements-extra`** and follow it. Its rules bind every lane.

## The three modes

All three use the same lanes ([lanes.md](lanes.md)); they differ in what each lane reads and which lanes run.

| Mode | When | Scope | Lanes |
|---|---|---|---|
| **Change** | On its own, whenever a piece of work finishes: after the full check (and live checks, where the work needs them) pass, before asking about committing. No need to ask first | The files the work changed (the session that did it lists them), new files included | The ones the change touches (below) |
| **Full** | When the maintainer asks | The whole repo, deepest on what changed since the last full review ([last-full-review.md](last-full-review.md)) | All of them |
| **Targeted** | When the maintainer asks for one thing: "security review", "review the staff lane", "perf of the sticky header" | What they named: a lane's area, a folder, a feature, or the whole repo for a concern | The one they named, or the lanes whose areas it falls in |

**Which lanes a change review runs:**

| The change touches | Lanes |
|---|---|
| `src/lib`, `src/site`, `src/storage`, `src/fetch` | core |
| `src/page`, `src/ui`, `src/scss`, `src/dev`, `src/resources`, the files at `src/` and `src/features/` top level | page-ui |
| A feature folder | that feature's lane: games, other-features or staff |
| A `*Settings.tsx` panel in any group | other-features too, for the `settingRowClasses` check only (lanes.md, the other-features row), as the panels are compared with each other |
| Anything in the build lane's area (lanes.md lists it: `build/`, `package.json`, the configs and dotfiles, `.github/` apart from issue templates, `.husky`, `.vscode`) | build |
| The skills or the docs (the skills lane's area) | skills |
| Any code or spec in `src/`, `build/` or `test/` | perf, tests and security, every time |
| `.github/workflows/`, `.github/actions/`, `package.json`, `pnpm-lock.yaml` or `.claude/settings.json` | security too |
| A component (`.tsx`), a stylesheet (`.scss`, `styles.ts`) or code that adds to the page's markup | accessibility |

The ponytail lane runs in full reviews only (bloat builds up across the repo, and a diff doesn't show it). A change to the skills or docs alone runs the skills lane only (with security too when it touches `.claude/settings.json`).

**A review's own edits aren't a piece of work:** its folder's files (`dist/refactoring-lanes/<review>/`, step 1), the package updates (step 2), the fixes it applies (step 6), and its close-out edits (decisions.md, the rulings and lessons in the project skill and history.md, open-items.md; step 7). Each, apart from the folder's files (scratch, deleted at close), is still checked by a verification session (steps 2, 6 and 7). But none starts a new change review, which would review the fixes again and never end.

## Ground rules

- **Settled is settled.** [decisions.md](decisions.md) lists what earlier reviews closed: kept by the maintainer, or rejected as not worth it. Every lane and verifier reads it first and drops a matching finding, unless the code has changed since in a way that undoes the reason. This is what stops each run from re-finding the last run's items. Every mode reads and adds to the same file.
- **Raise only what earns the churn:** bugs, real risks (data loss, a page broken, a leak, a security hole), dead code and files, rule breaks, duplicated logic, and changes with a clear payoff (smaller, faster, simpler for the next person). Not raised: rewording code that reads fine, renames by taste, "could also be done as…", or moving code between equally good places. **"Nothing worth raising" is a good result** for a lane.
- **Rules are questions, not walls.** When something conflicts with a skill rule, or a rule looks wrong, raise it as a question. Don't ignore it and don't quietly work round it. The maintainer may have got the rule wrong.
- **Never raise the emoji list or compress-json.** They stay.
- **Nothing is raised unchecked.** Every finding goes through a second agent before the maintainer sees it (step 4).
- **Visible changes need the maintainer's yes** before they're applied (the project skill's rule). Changes with no visible effect don't.
- **Lanes are read-only.** Only the coordinating session (the one running this skill) edits code: the package updates in step 2, and otherwise only after findings are raised and agreed.
- **Finding ids name their lane:** `games-3`, `security-1`, so the maintainer can see which lane raised each one.

## 1. Set up the review's folder

Every review gets its own folder, `dist/refactoring-lanes/<review>/` (git-ignored), named for its mode and what it covers: `full`, `change-<work>` (a short name for the piece of work, as in `change-sticky-header`), or `targeted-<what>` (`targeted-security`). Keep `<work>` and `<what>` to a few words: session titles (below) must stay under 60 characters. Everything the review writes goes in it, so reviews of any kind can run at once without overwriting each other, and closing one deletes just its folder (step 7). If the folder already exists, its `tracking.md` names the session that ran it. Carry on from it only when that's this session (`get_session` with `"self"`), or when that session is gone (`get_session` on its id fails, or shows `isArchived: true`). Otherwise it's another open review, even when that session is idle (`isRunning` only says whether it's mid-turn), so pick another name. If such a folder looks abandoned (a review stopped part-way), ask the maintainer before taking it over.

- **`tracking.md`:** at the top, the id of the session running the review (the coordinating session, from `get_session` with `"self"`); then a lanes table (lane, area, findings file, state), "Raised by the maintainer", "Verified findings (to raise)", "Merged / conflicts", "Rejected after verification" (each with the reason), "Agreed, to do", and "Done". Anything the maintainer raises alongside the review (a bug they spotted) gets its own entry under "Raised by the maintainer".
- **`<lane>.md`:** each lane's findings, with its verifier's verdicts beside them (step 4).
- **`verify-updates.md`, `verify-fixes-<n>.md`, `verify-closeout.md`:** the other verification sessions' reports (steps 2, 6 and 7; one `verify-fixes` file per batch).

**Session titles start with the review's name,** so each session shows which review it belongs to: `<review>: <lane>` (or `<review>: lanes` for a small change review, step 3), `<review>: verify <group>`, `<review>: verify updates`, `<review>: verify fixes <n>`, `<review>: verify closeout` (as in "change-sticky-header: verify features"). Leave `name` out: the app makes the short name from the title.

## 2. Update the packages (full reviews only)

Before any lane starts, the coordinating session brings every package up to date and fixes what the updates break.

- **Find what's newer.** Start with `pnpm outdated`, but don't stop there: it misses a package whose line has moved to a new name. Rsdoctor 2.0 put the rspack plugin in `@rsdoctor/core`, so the old package stops at 1.6.5 and reads as current. For each direct package, also check its newer majors, its deprecation notice and its release notes for a rename or a merge. pnpm also skips releases less than a day old (its built-in `minimumReleaseAge`), and `pnpm outdated` hides them: list any it held back under "Agreed, to do", for the next update pass.
- **Check Node's pin too:** compare `.nvmrc` with the newest patch of its Node line (a security release is often only a patch). `pnpm outdated` doesn't look at `.nvmrc` (an old pnpm pin it does list, as `pnpm (dev)`). Moving Node is the user's to do in their own terminal (the project skill's setup.md); then `.nvmrc`, `engines` and the versions written in the skill move with it.
- **Update everything, majors included,** unless decisions.md holds a package back with a reason. Read a major's migration guide before updating it. Installs follow the project skill's setup.md.
- **Fix what breaks, then run the project skill's full check** (specs, lint, dev build), plus `pnpm run build:prod-all`. Compare the prod builds' size with before the update.
  - An update that changes something visible needs the maintainer's yes, like any visible change.
  - An update that can't be made to work is rolled back and raised, with what failed.
- **Have it checked.** Start a verification session for the updates ("full: verify updates", read-only) with the same brief as step 4, given the versions and the fixes, writing to `verify-updates.md`. It can run alongside the lanes.
- **Record each update under "Done"** in `tracking.md`, one line each: the package, from and to, and what was fixed for it.

## 3. Start the lanes

Start each lane as its own session (`start_session`, `initiation: "user_asked"`, `context: "fresh"`, `use_worktree: false`), all at once. No need to ask first. Start lanes and verifiers on the model and effort [lanes.md](lanes.md) gives each ("Models"), unless the maintainer asks for others for this review. A session can't start one above its own, so if it's higher, start each with a holding prompt, raise it with `set_session_effort`, then send the brief. Title each `<review>: <lane>` (step 1), and give it its findings file, `dist/refactoring-lanes/<review>/<lane>.md`. The brief and the lanes are in [lanes.md](lanes.md); the brief says how each mode sets a lane's scope. Split or merge lanes if the repo has changed shape. Every source folder must be in exactly one area lane's area, apart from `test/`, which is the tests lane's (other-features also compares the settings panels in other lanes' areas, without taking them over).

- **Full review:** each lane looks hardest at its area's files in `git diff --stat <commit>` and in `git ls-files --others --exclude-standard` (the diff covers uncommitted changes to tracked files only: new files that were never added are in the second list), where `<commit>` is where the last full review ended (the command in [last-full-review.md](last-full-review.md)). The rest of the area gets a lighter pass for bugs and rule breaks only. When the command prints nothing (no full review has closed yet), every file gets the full pass.
- **Change review:** give each lane the list of changed files that fall in its area (perf, tests and security get all of them; accessibility gets the changed components, stylesheets and code that adds to the page's markup; other-features also gets any changed `*Settings.tsx` panel from another group, for the `settingRowClasses` check only, raising nothing else in it). A lane reads the code around a change where it needs to (callers, the spec beside it), but raises only what the change brought in or touched.
- **Targeted review:** give the lane what the maintainer named, for the full pass.
- **A small change review is one session.** When the change touches about 10 files or fewer, start one session (`<review>: lanes`) instead of one per lane: its prompt gives every lane the table above names, each with its own scope and list from lanes.md, and it works through them in turn, writing one findings file per lane (the ids still name their lane). Every session starts cold and reads the same skill files, so one session pays that once; the checks are the same. One verifier follows it (`verify all`, step 4). A larger change starts a session per lane.
- **Build figures, when the perf or build lane runs:** lanes don't build (lanes.md, the brief), so before starting them, build both sides and put the two prod builds' file sizes and compile times (rspack's "compiled successfully in" lines) in the brief. "Before" is `HEAD` for a change review (the work isn't committed yet), and the last full review's commit (last-full-review.md) for a full or targeted review, or `HEAD` when none has closed. When `git status --short` lists changed files this piece of work didn't touch (compare it with the work's own changed-file list), they're earlier uncommitted work, so say so beside the figures: "before" leaves that work out, so the difference isn't this change's alone. Build "before" with the project skill's build-and-ci.md → "Building an older commit", its build step `pnpm run build:prod-all && ls -l dist/local`. "After" is `pnpm run build:prod-all && ls -l dist/local` in this checkout (`dist/local` is untracked).

While the lanes run, carry on with independent work: the maintainer's own items, the tracking file, dry runs. Don't poll the sessions. The app wakes this session when they finish.

## 4. Verifying

When a lane finishes, read its findings file. A lane that found nothing worth raising needs no verifier. The others are verified a group at a time ([lanes.md](lanes.md), "Verification groups"): once every lane in a group that ran has finished (a change review skips some lanes, and ponytail runs in full reviews only), start one verification session for the group's findings files (`<review>: verify <group>`; read-only). Every verifier starts cold and reads the skill, decisions.md and history.md before it checks anything, so one per group pays that once for several lanes, and the group's lanes touch the same code. A group with more than about 25 findings gets two verifiers, split by lane (`verify <group> 1` and `verify <group> 2`), so the last findings get the same care as the first. A change or targeted review whose lanes found few findings uses one verifier for them all (`verify all`), up to the same limit. Start it, and every other verification session in steps 2, 6 and 7, with the same `start_session` settings as a lane (step 3), the brief below as its `prompt`, and a `background` of at least 80 characters naming the review, its mode and what it's checking. Its brief, which the verification sessions in steps 2, 6 and 7 share (they write to their own file in the review's folder, step 1, as they have no findings file to write beside):

- Read decisions.md first. Don't read the project skill's history.md whole (it's long, and mostly stories): search it for each finding's subject (its file, feature or rule), to see whether it's already settled there.
- For each finding, open the code and the rule it cites, and mark it **CONFIRMED**, **REJECTED** (with the reason: wrong, already handled, already in decisions.md or history.md, below the bar in "Ground rules", or not worth the churn) or **NEEDS-MAINTAINER** (a rule question or a visible change).
- Check every file, line, symbol and claimed usage itself (grep for callers before agreeing that something is unused).
- Run the specs or lint where that settles a claim.
- Write the verdicts beside each finding in its own findings file, under a `Verdict:` line.

Then copy into the tracking file: confirmed and needs-maintainer items go under "Verified findings (to raise)" with their ids, rejected ones under "Rejected after verification" with the reason. Rejected items are never raised as findings. If the maintainer asks, give the count and reasons.

## 5. Merging (when more than one lane raised something)

The coordinating session does this itself, as it copies each group's verified findings into the tracking file (step 4): it's the same reading, so it needs no session of its own. Once every verifier has finished, it goes over the verified findings, without re-checking them (the verifiers did), and:

- merges findings that are the same problem seen by two lanes (perf and page-ui both raising the same observer), keeping every id (`perf-2 = page-ui-4`);
- flags conflicts: one lane saying delete X while another says refactor X, or two fixes that touch the same lines;
- orders the list for raising: bugs and security first.

The result goes under "Merged / conflicts" in the tracking file. Conflicts are raised with the maintainer as one item each, with both sides.

## 6. Raising and applying

- Group by kind: bugs, security, rule questions, visible changes (with before and after), accessibility, performance, tests, build and packages, refactors and cleanups, skill and docs.
- Each item in plain words: what's wrong, why it matters, what the fix is, and whether it changes anything visible. File links, not code dumps.
- Ask only what needs an answer (visible changes, rule questions, larger restructures). Changes with no visible effect can be applied without asking.
- Record each answer in the tracking file beside its item. A ruling also goes into the project skill where the rule applies, with its story in history.md.
- Work through "Agreed, to do", moving each item to "Done" as one line when it lands. Put what was learned into the project skill.
- After each batch, run the project skill's full check (specs, lint, dev build), and prove each fix's spec fails without the fix with `pnpm test:mutate` (one experiments file for the batch). Do live checks for anything visible, in both themes, with screenshots for the maintainer. Then a verification session (`<review>: verify fixes <n>`, writing to `verify-fixes-<n>.md`) checks the applied fixes (the same brief as step 4, given the findings and the diff).
- **A follow-up goes back to the verifier that raised it.** When a verifier confirms a problem with an applied fix, fix it and send the fix to that same session (`SendMessage` to its id) to check again, instead of starting a new one: it still holds the finding, the code it read and its reasoning, so it looks only at the change, and the agent that found the problem judges the fix. Go back and forth until it confirms nothing, and record each round in its report file. Only when its session is gone, or the follow-up is trivial (a comment, a test name), does it go into the next batch's check instead. The last batch has no next batch, so its loop always closes in its own verifier before step 7. Step 2's update verifier and step 7's close-out verifier work the same way.
- A fix that changes a feature updates `FEATURE-DOCUMENTATION.md` and `CHANGELOG.md` in the same piece of work.
- **After each verification pass of applied work, ask about committing,** and commit only on the maintainer's answer. After the last batch (nothing left under "Agreed, to do" and nothing waiting on the maintainer's answer), the question waits for step 7, so the fixes and decisions.md are asked about once. On a branch other than `main`: a new commit on it, or amend its latest. On `main`: a new branch for the work (never a commit to `main`). Say what would go in (`git status --short`) and, before amending, what the latest commit is and whether it's been pushed (amending a pushed commit means a force push, which needs its own yes).
- **Every change review ends with step 7 (which asks about committing), whatever it found,** as the work it reviewed still needs that question:
  - nothing to raise: say so in a line (which lanes ran, nothing found). If verification rejected nothing a later run could raise again, there are no close-out edits, so step 7 is just asking about committing, deleting its files and offering to delete its sessions; otherwise step 7 runs as usual;
  - every finding declined: nothing is applied, so there's no verification pass, but step 7 runs as usual (the declined items go into decisions.md and get the close-out check), and ends by asking about committing.

## 7. Closing

When every item is done, rejected or answered:
- **Update decisions.md first, so the next run doesn't find it all again:**
  - add each item the maintainer declined or kept, one line each with the reason;
  - a finding verification rejected that a later run could plausibly raise again (not plain mistakes) goes in only after the maintainer has seen it: put each to them (what it is now, re-checked against the code) and record their answer, never the verifier's verdict alone;
  - remove entries whose code is gone;
  - **a full review only:** add one to the count in [last-full-review.md](last-full-review.md), so the next full review starts from this one's commit. Change and targeted reviews leave that file alone.
- Move anything still open (a check that needs a release, staff access or the user's click) into the project skill's `open-items.md`.
- **Have the close-out edits checked** before committing or deleting anything: a verification session (`<review>: verify closeout`, writing to `verify-closeout.md`; the same brief as step 4) over the diff of decisions.md, the skill and history.md lines, open-items.md and (for a full review) last-full-review.md, against the tracking file. It checks that each entry says what was decided and why, sits in the right file, and breaks no rule of the project skill (no dates outside history.md, no account details in the shared files). Fix what it confirms and send just those fixes back to it (step 6, "A follow-up goes back to the verifier that raised it"), until nothing is confirmed.
- **Then ask about committing** (step 6's rule): decisions.md (and, for a full review, last-full-review.md) goes in the same commit as the review's fixes (or an amend of it), so that commit is the one the next full review starts from.
- Delete this review's folder, `dist/refactoring-lanes/<review>/`, and nothing else. Never delete `dist/refactoring-lanes/` as a whole: another review may still be open, and its files are git-ignored, so nothing could bring them back. The decisions are kept in decisions.md.
- Offer to delete the lane and verification sessions (the maintainer prefers deleting to archiving; their findings are in decisions.md).
