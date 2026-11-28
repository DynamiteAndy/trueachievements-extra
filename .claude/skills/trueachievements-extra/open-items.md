# Open items

Everything carried over from finished sessions that's still to check or do, in one place for every session so nothing is lost (the maintainer's rule). None here is a known bug: most are checks an agent can't do yet, because they need staff access some accounts lack, a site event, a release, or clicks that save (the user's to make). Add new ones here and say what each needs; who is getting it for this account goes in local.md (git-ignored: the repo is public). Take an item out once it's done, with what was found going into the right skill file.

**Two lists, split by whether the work is still going on** (the maintainer's ruling):
- **`refactoring.md`** at the repo root (git-ignored) holds work in progress, within a session and across the sessions running now: bigger refactors and the like. A review tracks its own work in its folder, `dist/refactoring-lanes/<review>/` (repo-review, step 1). Create `refactoring.md` when there's something to note, and delete it once its items are done. When an item lands, move it to a "Done" section as one line, and put what was learned into this skill. Fold later updates into an open item's text. Never delete an item while the list is in use: correct a wrong claim in place, and move one judged not worth doing to its own section with the reason.
- **This file** (committed) holds what's carried over once a session has finished, for every later session: checks still to do and anything else that mustn't be forgotten. An item still open in `refactoring.md` when the work ends moves here.

**Before starting a session's work, glance at this list** and mention any item the user might now be able to unblock (local.md says what this account is waiting on).

## Needs the next release

### `main`'s ruleset and the bot's dist commit

- **The check:** on the next version bump, does `main`'s ruleset ask for an extra approval because of the bot's dist commit on the pull request (`require_extra_approval_for_unattributed_changes`)? If it does, the merge waits on that approval.
- **What it needs:** a release.
- Record the answer in build-and-ci.md → "`main` has a ruleset".

## Needs a Mac

### The tab bars and a right-click on macOS

- **The change:** a tab bar's drag-scroll starts on the left button only (`ui/tabs/TabBar/use-tab-bar-scroll.ts`, `useDragScroll`'s `press`). On macOS the context menu opens on the right button's press and takes its release, which left the bar scrolling as the pointer moved.
- **The check:** on a Mac, with a fresh `pnpm run build:dev`, right-click a tab in an overflowing tab bar (the settings menu's, the emoji picker's or Extra Guides'), close the context menu, and move the pointer over the bar: it shouldn't scroll.
- **What it needs:** someone with a Mac and the dev script.

## Needs the user's click

### Improved image selector names after an upload

- **The worry:** the selector reads the image list's anchors once (`edit-walkthrough-page/ImprovedImageSelector/ImprovedImageSelector.tsx`, the `useMemo` over `.ivimage a`, keyed only on the image viewer), so if the site adds an uploaded image to the list in place, the new image shows no name until a reload.
- **The check:** on a walkthrough edit page with a fresh `pnpm run build:dev`, the user uploads an image through Add images (it opens a child window, `multiimagehandler.aspx`). Then open the image selector: does the new image have its name under it? If not, is `.imageviewer` the same node as before the upload (the site appended to it) or a new one (our controller should have re-mounted)?
- **The fix if it fails:** keep the anchors in state, filled from `mutationObserver.onElementAdded('.ivimage a', …, { root: imageViewer })`.
- **What it needs:** the user's upload (it saves to their walkthrough), on an edit page their account can open.

## Needs staff access to a particular walkthrough

Which walkthroughs this developer's account manages, their statuses and the access asked for are in local.md. The how-to for each page is in [staff-pages.md](staff-pages.md).

### The manage page's post backs on an In progress walkthrough

- **The worry:** the walkthrough preview keeps a walkthrough's cached copies after a manage page post back that changes nothing (`walkthrough-preview/postback-command.ts`, its list of view-only commands, read live from a published walkthrough's manage page and walkthrough page). A published walkthrough's manage page has no controls for adding or removing its games, gamers or pages, and most of its fields are read-only, so whatever an In progress walkthrough adds wasn't seen. A command missing from the list drops the copies, so nothing goes stale; a view-only one missing from it only costs a fetch.
- **The check:** on an In progress walkthrough's manage page, read each control's `Postback('<command>', …)` from its `onclick`, `href` or `onchange` (reading only, no clicks). Add the commands that change nothing to the view-only list, with a spec row each.
- **What it needs:** an In progress walkthrough the account can manage (as "Selecting an existing page on the manage page" below).

### Manage walkthrough's table links on a long walkthrough

- **The change:** the controller hands the table links the achievements panel only once the list's total (`#lstWalkthroughAchievementID .total`, after the table) has turned up and the duplicates are merged (`ManageWalkthrough.tsx`), so the links read the whole, merged list.
- **The check:** on a walkthrough with hundreds of achievements, are all rows linked once the page has loaded, and does the `/N` count the merged rows? One load covers this and the merge's check below.
- **What it needs:** team access to a long walkthrough, e.g. 1418 (Halo: The Master Chief Collection, 700 achievements), which only its team can manage. A 20-achievement one gave all 20 their links, too short to show it.

### A walkthrough whose achievements are on two games' pages

- **The worry, twice over:**
  - The preview's Walkthrough Achievements reads only the first game's achievements page (`walkthrough-preview/aside-content.ts`: `getAchievementsInWalkthrough`, from the `walkthroughMarkup.previewGameLinks` read), so a second game's achievements would be missing.
  - The manage page's table links match achievements by name across all the walkthrough's games and take the **first** game's link (in the preview's game order) for a name on two games' pages (`manage-walkthrough/clickable-table-links.ts`, `linkAchievements`), so such a name could link to the wrong game.
  - Both match the manage page's achievements table by name alone, one row per name, the first row winning (the preview's `rowsByName` in `getAchievementsInWalkthrough`, the table links' `cellsByName`). Once the preview reads a second game, two achievements of the same name (one per game) would both take that first row and its page. Revisit the match then (the maintainer's ask): the table's rows may say which game each is from.
- **Waiting on this check:** one shared reader of every game's achievements for the preview and the manage page (they each read them now).
- **What it needs:** team access to a walkthrough covering two games (e.g. a game and a separately listed version or DLC) with achievements from both, ideally one name in both. A walkthrough listing several games whose achievements are all the first game's can't show either.
- **A candidate (found by a web search, not by scanning the site):** TrueAchievements' "game stacks" attach several versions of a game to one walkthrough, with a version dropdown above its achievement lists. Their example, **Viva Piñata (walkthrough 616)**, lists two games: Viva Piñata (Xbox 360) and Viva Piñata (GFWL), 50 achievements. Its staff preview opens for a staff account off its team, but our side column is removed there, as for any walkthrough the account isn't on the team of (the feature reads its manage page). Note a stack's variants swap the main version's achievements, so whether its achievements really sit on two games' pages is part of the check.

### Selecting an existing page on the manage page

- **The check:** the manage page's page view with an existing page selected (its fields filled), and our Ready for review and missing buttons in it (that view has no Action menu to move). The view itself was checked through **Add page** (a new page's form) on a published walkthrough: all right.
- **What it needs:** an **In progress** walkthrough the account can manage: Add page, then a row. A row click alone does nothing, and no address selects a page (staff-pages.md has what was tried). Each click is a postback: ask the user first.

### Manage walkthrough's merge of an achievement listed on two pages

- **The change:** the merge of duplicate achievement rows reads and writes `textContent` (`manage-walkthrough`, timed as `Manage walkthrough: merge duplicates`). Only its spec fixture covers the merge itself: no walkthrough this account can manage (local.md) lists an achievement on two pages.
- **The check:** on a walkthrough with an achievement on two pages, the merged row shows both pages and the totals match the server's. The merge waits for the list's total, so on a long list a duplicate near the end is merged too (the same load as the table links' check above).
- **What it needs:** team access to such a walkthrough, e.g. 1418 (Halo: The Master Chief Collection).

### The walkthrough preview's achievements by page on an in-progress walkthrough

- **The change:** the preview reads each achievement's page cell once (`walkthrough-preview/aside-content.ts`, timed as `Walkthrough preview: achievements by page`).
- **The check:** on an **In progress** walkthrough's preview, each achievement still shows under its page, as before the change.
- **What it needs:** an In progress walkthrough the account can preview.

## Seen, not fixed (each needs the maintainer's call)

### The sticky header and what's stuck under it

Found by the sticky regression sessions, all there before the review:
- **A short window:** the stuck page history runs past the window's bottom, so Back to management and Edit page can't be reached until the page's end. Two fixes offered (shrink its version list to fit, or don't stick it when taller than the window); the maintainer set it aside for now.