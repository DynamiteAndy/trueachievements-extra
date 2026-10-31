# Review decisions

Everything a review has already settled and shouldn't raise again: what the maintainer declined or kept, and what verification rejected as not worth doing. **Every lane and every verifier reads this first.** A finding that matches an entry is dropped, unless the code it's about has changed since the decision in a way that undoes the reason given (then say what changed).

Each entry is one line: the subject, the decision, and why. The full story, where there is one, is in the project skill's history.md. Add an entry when a review closes (the repo-review skill, step 7). Remove one when its code is gone.

## Last review

- **Where the last full review ended** is in [last-full-review.md](last-full-review.md), not here: every review mode adds to this file, so its latest commit no longer marks a full review.

## Kept by the maintainer

- **The emoji list and compress-json:** stay. Never raise them.
- **The Games tab's Forums group keeps its name** beside the Forums tab: the maintainer chose to have the shared override hint name "the Forums tab" rather than rename the group.
- **Font Awesome icons:** stay in their npm packages, `free-regular-svg-icons` included for one icon. Never inline a Font Awesome icon's definition. The maintainer keeps control of the versions.
- **`rspack-merge`:** stays for the dev and prod configs, although plain spreads give deep-equal configs.
- **Shared files with one user:** stay shared: pure `lib/` helpers, `ui/icons`, `ListSetting`/`ListSettingItem`, every URL check in `site/urls.ts`, `site/sentences.ts`, `controllerButtonStaticFolder`, `page/intersection-observer.ts`, `page/sticky/`. These are the folder rule's listed exceptions.
- **`saveSetting` and `ImprovedImageSelector`'s `setId`:** stay. Lint's `react(immutability)` refuses assigning `.value` on a prop, so they can't be inlined.
- **The news highlight margins in `base.scss`:** stay. They keep a highlighted news item in line with the other rows.
- **The tab bars' per-position selected-tab colours:** intended, not a leftover.
- **The sticky header starting hidden on a page loaded part-way down:** intended.
- **The six "site buttons":** stay separate. They mirror different site markup.
- **A setting with nothing to do on the page yet:** stays registered and checks again when applied (Individual Progress, Collapsible Groups on a game without DLC).
- **A forum link naming a tab keeps it:** Default Thread Type applies only when the address has no `type`.
- **Fixture capture headers' dates:** stay, as the no-dates rule's named exception.
- **CI:** extra runs (scheduled or repeat) and coverage thresholds are allowed (standard runners are free on this public repo) as long as runs are cleaned up: cancelled when superseded; a pull request's runs before its previous commit deleted by its next run (`prune-old-runs`), and the dist commit's held runs by the job that pushed it; deleted by `cleanup.yml` when held for approval or over two weeks old; no release build on a draft; and no lint, test or build on the release's dist commit. Keep runs quick.
- **`unsafeWindow`:** stays banned apart from the DevTools hook. Never suggest it.
- **`refactoring.md` beside `open-items.md`:** not a contradiction. One is for work in progress, the other for what carries over.
- **htmlnano:** stays, although it saves under 100 bytes gzipped; only its `minifyJs` is off (no terser warning).
- **`staff/walkthrough/shared/walkthrough-markup.ts`:** stays one file. It's the manage page's markup in one place, which both staff features read. Only the preview-only path moved out.
- **The settings menu footer's line under Raise a Bug / Request a Feature:** stays black in dark theme (our `border-color: #000`).
- **A toggle with sub-settings:** the toggle is `noBorderWhenChecked`, the rows it reveals `underToggle` (Remain Stuck and the "Override … Settings" toggles included: "it's a grouping").
- **The settings menu's lines:** the gamer menu's rule, drawn by the stylesheet from a row's place and checked by `settings-menu-lines.spec.tsx` (components.md). Helper text stays 12px in its own colour; the tabs and the footer stay as they are.
- **The ➤ marker on the settings menu's markdown lists:** stays centred on its item, also on long ones (the maintainer, over moving it to the first line).
- **The Credits heading's yellow lines** (none on Changelog's): stay. They part Credits from the changelog above it; on Changelog they'd sit right under the tab bar.
- **The keyword lists' row** (Keywords): its label's 5px gap above the field and its 13px items (the site's own panel `li` rule) stay; the items are values, not helper text.
- **The Feature Documentation:** mirrors the settings menu, an accordion per tab (SKILL.md); its wording was trimmed with the maintainer's OK, so don't re-expand it.
- **jscolor:** stays, with the site's 39 colours as swatches, and it also drives Text color / Background color. It was compared against Coloris, Pickr, vanilla-colorful, iro.js and a picker of our own; size (about 13 kB gzipped) and its GPL licence were known.
- **`AskForm`'s own click handler:** stays. `linkAction(send)` trips lint's `react(refs)`, because its callbacks read a ref (components.md).
- **`@preact/signals-devtools-ui` (an in-page signals panel in dev builds):** not wanted. `@preact/signals-debug` console logging is in instead.
- **The YouTube player's `title="YouTube video player"`:** stays ours. The site's lazyYT iframe has none (site-looks.md).

- **Staff-only CSS in the shared stylesheet** (28% of it, 1.6 kB gzipped): stays. Rules are scoped, so splitting it saves under 1 ms of parse time, not worth a second stylesheet path.
- **A `.meta.js` header file for `@updateURL`:** not wanted (the maintainer: leave it).
- **Byte-exact per-source sizes** (a source-map script or `sonda`): not wanted. Rsdoctor (`pnpm run analyse`, `analyse:diff`) is enough.
- **knip:** not added. Its one run found two stale exports, both removed.
- **Codecov bundle analysis:** not added. Codecov Test Analytics is in (`ci.yml`).
- **The settings menu's 350px minimum height:** stays, although a window under about 382px then runs its footer's version line past the bottom. It follows TA's own gamer menu (the maintainer).
- **"Renders the text as text" guards** (ImageTitle, ManageWalkthroughAchievementRow, WalkthroughPageRow specs): stay. They guard text other people write against a switch to `dangerouslySetInnerHTML`.
- **A component's spec checks its own branches,** even one the feature spec above also renders (WalkthroughEditors' bare picture and `rel`): don't delete it as redundant.
- **Each control's Space row in its Enter/Space table:** stays, as its "works like a button" contract, although `clickOnEnterOrSpace` has its own spec.
- **The walkthrough editor's Controller Buttons and Insert Xbox captures fallbacks:** stay, although the site's toolbar has both today: there was a time when it didn't.
- **The intersection service's observer per root, margin and threshold:** stays general, although its one caller passes none. It's a twin of the mutation and resize services (the folder rule's exception).
- **"Never TypeScript `any`":** means `any` written in our code. Implicit `any` from a library's types isn't covered.
- **A pnpm other than the pinned one:** stops with an error (`devEngines.packageManager.onFail: "error"`), rather than switching itself.
- **Indirect packages:** the update step and its verification check direct packages and the Node and pnpm pins only; pnpm looks after the rest of the lockfile. The build lane has no lockfile check; the security lane's supply-chain check of it stays.
- **The comment-stripping plugin in `rspack.prod.conf.ts`:** stays. rspack's `extractSourceMap` leaves the two Preact Signals `sourceMappingURL` comments, which sit mid-line.
- **The giveaway forgetting what it tried when the same gamer signs out and back in:** fine. At most one extra post, and usually none, as the fresh page already shows the giveaway entered.
- **The `slide-under-sticky-header` mixin with one user:** stays as a mixin.
- **The explicit lint rule lines that match oxlint's defaults** (`react/jsx-key`, `react/exhaustive-deps`, the `jsx-a11y/*: "error"` lines): stay. They keep the rules on if a later oxlint moves them out of its defaults. The three vitest lines are needed anyway: the plugin is on only in the specs override, where the defaults don't apply.

## Rejected by verification

Each was checked and judged not worth doing. Don't raise it again unless the reason no longer holds.

- **`YouTubeVideo`'s inline `padding-bottom`** equal to its stylesheet's: it mirrors the site's lazyYT markup, which sets it inline.
- **`MemoizeFetch` as a class:** it has two instances (the preview's public pages pass their own fetch).
- **The CHANGELOG's 4.0.0 renames line opening with "Renamed":** no rule sets the changelog's verbs ("Optimised" and "Initial" open lines too), and the maintainer approved the line (the maintainer agreed).
- **`class-names.spec.ts` reading every file's `ta-x-` names, not only `styles.ts`:** the names outside a `styles.ts` are mostly element ids, the scan would need an allowance for the accordion's id prefix, and none clash (the maintainer agreed).
- **Observer services re-reporting an element to earlier matchers; the resize observer never disconnecting:** the callbacks are idempotent, and an idle observer costs nothing.
- **`logger.info` with no production caller:** one level of the logger's own set.
- **A shared reader for every game's achievements (preview and manage page):** waits on the open-items.md check for walkthroughs covering two games.
- **The preview's lookup not cancelled on unmount:** nothing outside specs unmounts the aside.
- **The walkthrough statuses written in two places:** the settings list is the site's filter, the preview's the subset it covers. They only look alike.
- **The one-task `allConcurrently` in manage walkthrough:** it catches a throw, so the entry still hands back its unmount.
- **`maintenance.ts` building the page's `outerHTML` on every visit, before `refreshMemoizedFetch` finds whether it's cached:** measured at about 3 ms on a very long page.
- **Splitting live checks, or SKILL.md's folder rule, into their own skill or file; regrouping history.md; reshaping page-map.md's tables; shortening the skill description; CLAUDE.md repeating SKILL.md's first step:** each costs more than it saves for the agents reading them.
- **The Node and pnpm versions in several places:** SKILL.md's start-of-session check needs them inline, and setup.md lists every place to bump.
- **No `test` script in package.json:** the skill, CI and VS Code all use explicit commands.
- **`condense-cli.ts` parsing its own arguments** rather than `node:util`'s `parseArgs`: it works, and the saving is a handful of lines.
- **The dev-watch task's ts-loader problem matcher:** its background patterns match rspack's output, which Debug Chrome's wait needs.
- **VS Code's template comments in `.vscode` files:** the comments rule covers `src` and specs.
- **Specs that looked redundant but each catch a break of their own:** urls.spec's hole test (a short array), `controllerButtonStaticFolder`'s only check, a feature's own selector check, GuideSitePanel's guide-already-known look-up row, the giveaway's "if not enabled" row (the live-settings rule), and a test over real data that is the only behaviour check of its path.
- **Small spec merges below the bar:** the picker-theme table, trimming assertions that repeat a lower component's spec, a merge that reads worse than the tests, and the read-guide-page, add-achievement-leaderboard-link, guide-site-links, floating-menus and workflows tables; `sticky.spec.ts`'s 200px/100px pair, as each catches a break the other doesn't.
- **A real sleep in place of `tick()` to catch a look-up delayed by a timer:** the specs wait with `tick()`, so only a deliberate 5 ms+ timer in an effect would slip by.
- **A redirected fetch cached under the address asked for:** the pages we cache are fetched from pages already signed in, and a public page's redirect is right to cache.
- **The "…WithId" URL checks accepting an empty id:** nothing goes wrong; it would only tighten them.
- **`callAll` stopping at the first undo that throws:** none of the undos can realistically throw (`moveInto` guards a moved reference, the effects catch their own errors).
- **A listener added during a response also getting that response:** no caller does that.
- **`waitForSideColumnSlot` waiting out its 10 s on a page with no side column:** no feature calls it there.
- **Releasing a drag over a tab selects it:** it doesn't; the click goes to the tab bar.
- **Default Status's all-won check reading the list as shown:** a fresh GET always shows All (site-quirks.md).
- **Old Gamertag Nation `games.php` guide links:** no released version could store one.
- **`build/link-editor-tsdk.ts` linking macOS and Linux to a missing folder:** tsrs ships `tsdk/`.
- **The specs' compiled CSS not byte-identical to the build's:** only the spacing inside `calc()` differs.
- **jscolor's auto-install reading `data-jscolor` attributes:** nothing puts such markup on the staff edit page, and patching it would break our pickers.
- **Walkthrough ids in history.md's stories:** they're about the site, and the ids are already in tracked specs and fixtures.
- **A rule found only in history.md, and the "six site buttons" entry naming none:** below the bar; components.md already says to check the real markup first.
- **A spec for the posts list never loading:** the section asks for the link either way.
- **The settings footer's link contrast:** white, 7.53:1.
- **The wrench's dark focus ring in the dark theme:** the site's own header links have the same ring.
- **`createPageScript` written out where `addPageScript` would do:** scripts added to `<head>` would leak between specs (`isolate: false`), and preventing that costs more lines than it saves.
