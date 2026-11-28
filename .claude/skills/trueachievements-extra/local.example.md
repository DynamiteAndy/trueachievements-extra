# Local: this developer's account and machine (template)

Copy this file to `local.md` in the same folder and fill it in (the agent offers to do it with you: [creating-local.md](creating-local.md)). `local.md` is git-ignored: it holds what depends on whose TrueAchievements account and machine it is, and the shared skill files point to it. Leave out what doesn't apply (no staff access: skip the walkthrough sections; staff pages then can't be checked live, only through the fixtures).

## Account

- **Gamer:** your gamertag, your gamer id (the `GamerID` cookie, which `?gamerid=<id>` pages take), and whether you're TrueAchievements staff (walkthrough team: the staff pages open for you).
- **TA Pro:** yes or no. Pro accounts get no adverts on the site (`/gopro`), so with Pro you never see the in-content ad rows in sale tables (check them signed out, or with Show ads on: site-quirks.md).
- **Walkthrough threads your account owns,** for show owner progress (`/forum/viewthread.aspx?tid=<id>`): look in My Threads (`/forum/viewthreads.aspx`) for walkthrough discussions, and check each one's "Walkthrough Information" names you as owner.
- **Stored guide links:** a game you've linked a guide site for, if any (a game with many achievements without solutions is best).

## Site preferences (put each back after a check)

- **Theme:** your theme: dark or light. The agent switches it for checks and puts this one back.
- **"Show secret achievements I don't have"** (`/customize.aspx`, Site Settings, Achievements): on or off (on means your account never sees `data-secret` markup).
- **"Sort by won first"** (`chkSortByWonFirst`, a game option): on or off.
- **Other `/customize.aspx` settings that change pages our features run on** (read them there; leave out personal fields such as your birthday): achievements ("Accentuate achievement won status", "Hide solutions by default", "Group DLC achievements in list view", "Group DLC in achievement list", "Show achievement descriptions in lists", "Auto expand spoilers"), games lists ("Show my game collection on games tabs", "Hide completed games"), forums ("Default to show unread threads only", "Default to show all my forums threads", "Hide deleted posts", "Auto collapse comments"), news and general ("Hide sponsored news items", "Show ads" for Pro, "Use 24 hour clock for times").
- **Our own settings** you keep on that a check relies on (e.g. the edit walkthrough autosave notification).

## Walkthroughs this account can open or manage

- **Your walkthrough list:** the manage page without `?walkthroughid` lists the walkthroughs you can manage, with their ids (each row's `Postback('lstWalkthroughIDE','<id>')`); `/gamer/<your gamertag>/walkthroughs` lists the ones you own with their status, publish date and thanks, and `/gamer/<your gamertag>/walkthrough-contributions` the ones you contribute to (both public, no ids).
- **A walkthrough you can manage and edit:** its id and name, and a few page ids (one with a long page, which scrolls and has Edit/Unlock buttons).
  - Its manage page: `/staff/walkthrough/managewalkthrough.aspx?walkthroughid=<id>` (how many achievements).
  - Its walkthrough page with a page selected: `/staff/walkthrough/walkthroughpage.aspx?walkthroughid=<id>&walkthroughpageid=<page id>`.
  - Its previews: `walkthroughpreview.aspx?walkthroughid=<id>`, `walkthroughpagepreview.aspx?pageid=<page id>`.
- **Edit page pairs** you can open (`editwalkthroughpage.aspx?walkthroughpageid=<page>&walkthroughpagecontentid=<content>`; the content id isn't in the page's markup: copy a page's edit link once).
- **A walkthrough covering several games**, if you can manage one (for the games table's links).
- **A published walkthrough** you can open (a loaded preview to check with).
- **A long walkthrough** (hundreds of achievements) you can manage, if any (the table links' timing).
- **What open-items.md's items wait on for you:** who is getting each one's access, and what you've asked for and when.
- **Walkthroughs you can't manage** (for the access-denied case), e.g. whether you can open #BLUD, 4138 (the specs' walkthrough) or 1418 (Halo MCC, 700 achievements).

## Games this account has played (for the defaults and list waits)

Read them from `/gamer/<your gamertag>/games` or `/gamecollection` (signed in); counts change as you play.

- **A game part-won** (posts back to a default status), with its won count, e.g. Gears of War 4's DLC and challenges pages.
- **A game fully won** (never posts back).
- **A long list you haven't played** (no status filter), or note that Halo MCC (700) is played.

## Machine

- **Repo:** its path (Windows and Git Bash forms), so Bash commands start with `cd <repo> &&`.
- **Node and pnpm:** how they're installed (nvm-windows, Volta, plain installer…) and where, so agent shells resolve `node` and `pnpm`. With the Claude desktop app on Windows, anything under `AppData` is a private copy for the app: keep Node and global tools outside it, and note what the agent can't run (e.g. `nvm`) and so must ask you to run in your terminal.
- **pnpm store:** its path, if not the default.
- **Dev build:** whether `dist/trueachievements-extras.debug.js` exists yet (`pnpm run build:dev` makes it).
- **Chrome:** Claude in Chrome set up in your Chrome, signed in to TrueAchievements; Tampermonkey with the dev script installed from `dist/trueachievements-extras.dev.user.js` (it `@require`s the local `debug.js`: Tampermonkey needs access to file URLs); the Preact DevTools extension; whether the agent may change which Chrome tab is active (to bring a tab to the front).
- **Signed-out test browser:** which browser it is (e.g. Edge), its Claude in Chrome device id (`list_connected_browsers`), and your own Chrome's, so the agent picks the right one.
- **ffmpeg:** its path, for screen recordings ([live-site.md](live-site.md) → "Recording and capturing an issue").
- **Window and screen:** your Chrome window's outer and inner size, and the screenshot scale (CSS px per screenshot px), for layout checks.
- **File handle tools** (optional, for refused writes): e.g. Sysinternals Handle's path, or an admin scheduled task that lists handles in the repo, and how to start it.
- **The write-or-catch helper** scripts use instead of `fs.writeFileSync`: it catches a refused write, runs the handle tool at once, and logs the time and file (shell.md).

### Refused writes on this machine (the log)

- Date, time (UTC), file, what ran before, what was running, what Handle found, what happened on retry.
