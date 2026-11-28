# Creating local.md (a developer's first session)

[local.md](local.md) is git-ignored and holds what depends on the developer you're working with. When it's missing, offer to create it with them before the task (SKILL.md); if they'd rather not, ask only for what the task needs.

Copy [local.example.md](local.example.md) to `local.md`, fill in what you can find yourself, then ask once for the rest. Change nothing on the machine, and nothing on the site apart from the one accepted change in step 2 (opening one manage page, which changes the walkthrough selected in the site's session).

1. **The machine, from the shell:**
   - the repo path (Git Bash `pwd`, and `pwd -W` for the Windows form);
   - where `node` and `pnpm` resolve (`where node`, `where pnpm`, `node -v`, `pnpm -v`; [setup.md](setup.md) if they're wrong);
   - the pnpm store (`pnpm store path`);
   - whether a dev build exists in `dist/`;
   - where `ffmpeg` resolves (`where ffmpeg`), for screen recordings; ask the user if it finds nothing.
2. **The account, from the user's Chrome** (Claude in Chrome; [live-site.md](live-site.md) for the tools; ask first, and open your own tab). Close the tab after.
   - **Signed in or not:** `[data-tgl="nav-gamer"]`, and the `GamerID` cookie, whose value is the gamer id to record.
   - **The theme:** `div.page`'s `data-theme`.
   - **TA Pro and the site settings that change our pages,** from `/customize.aspx`: read each control's state. Skip personal fields such as a birthday, and never record values like an email.
   - **Staff access:** open `/staff/walkthrough/managewalkthrough.aspx`. A walkthrough team account gets its walkthrough list: record each row's id and name from its `Postback('lstWalkthroughIDE','<id>')` link, and open one's manage page to check it can be managed. Don't open them all: each changes the walkthrough selected in the site's session. That one change is accepted.
   - **Their statuses:** `/gamer/<gamertag>/walkthroughs` (owned) and `/gamer/<gamertag>/walkthrough-contributions` (contributed to; the manage list can hold some of these too), both `#oWalkthroughList` (walkthrough, status, published date, owner, time). They're public but have no ids, so match by name; a public title can differ from the manage list's name.
   - **Walkthrough threads the account owns,** from My Threads (`/forum/viewthreads.aspx`, the threads it follows): open each walkthrough discussion there and check "Walkthrough Information" names it as owner.
   - **The dev script and DevTools:** whether the dev script runs (our settings wrench, `.js-ta-x-settings-menu-wrench`) and whether Preact DevTools is there (`window.__PREACT_DEVTOOLS__`).
   - **The games the account has played,** from `/gamer/<gamertag>/games` (signed-in only; table `#oGamerGamesList`: Game, Ach "x of y", TA, GS, %; 100 a page, most recent first; its pages are post backs, so read the first page only) or `/gamer/<gamertag>/gamecollection` (the collection, with time played, started and completed dates; paged too). From them pick a game part-won (posts back to a default status) and one fully won, and note a long list not played.
3. **Ask the user, in one message,** for what can't be read: edit page links for walkthroughs they can edit (the content id isn't in the markup), whether the agent may change their active Chrome tab, their signed-out test browser (setup.md), and anything from step 2 that didn't load.
4. **Write local.md** with what you found and what they said, show them a short summary of it, and say what's still blank.
