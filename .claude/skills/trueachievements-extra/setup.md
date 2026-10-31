# Setup: Node, pnpm and dependencies

The project needs **Node 26.13.1** (`.nvmrc`, which CI reads; `engines.node` in package.json is the minimum, `>=`, enforced at install by `engineStrict: true` in `pnpm-workspace.yaml`: a wrong Node fails `pnpm install` with `ERR_PNPM_UNSUPPORTED_ENGINE`) and **pnpm 12.23.0** (`packageManager`; `devEngines.packageManager`, with `onFail: "error"`, makes npm refuse to install).

## 0. First time on a machine (a new developer)

1. **Node and pnpm** at the pinned versions, installed outside `AppData` if the agent runs in the Claude desktop app (section 1), then `pnpm install` (section 2).
2. **A dev build and the dev script:** `pnpm run build:dev`, then install `dist/trueachievements-extras.dev.user.js` in Tampermonkey (in Chrome). It `@require`s the local `dist/trueachievements-extras.debug.js` by a `file://` path, so allow Tampermonkey access to file URLs (Chrome's extension details: "Allow access to file URLs"). Only the first copy of the script to start on a page runs (`src/claim-page.ts`), in Tampermonkey's order: put the dev script above the release ones, or disable them. A dev build that starts second shows a toast saying which copy runs instead. Reinstall the dev script whenever `build/metadata.ts` changes (SKILL.md).
3. **For live checks:** Claude in Chrome in that Chrome, signed in to TrueAchievements; the Preact DevTools extension (dev builds hand it the hook, page-map.md → "Switching states").
4. **A signed-out test browser** (for signed-out checks, live-site.md → "Opening a page"): a Chromium browser other than the one you use TrueAchievements in (Edge comes with Windows), never signed in to TrueAchievements. In it: allow extensions from other stores if it asks; install Claude in Chrome and sign in with the same Claude account; install Tampermonkey and, in its extension details, turn on "Allow access to file URLs" and "Allow user scripts" (or the browser's developer mode); open `file:///<repo>/dist/trueachievements-extras.dev.user.js` and install it; and Preact DevTools, with its site access set to all sites (otherwise its hook never reaches the page, and component states can't be switched there). It then shows up as a second browser in `list_connected_browsers`: note its device id in local.md.
5. **ffmpeg** (optional, for recording an issue as real video: [live-site.md](live-site.md) → "Recording and capturing an issue"), anywhere on the PATH or noted in local.md.
6. **local.md:** copy [local.example.md](local.example.md) to `local.md` (git-ignored) and fill in your account, site settings and machine; the agent offers to do this with you if it's missing.

## 1. Node and pnpm

Both should just work once set up: agent shells (Bash and PowerShell) should resolve `node` and `pnpm` to the same install as the user's terminal (where that is on this machine: local.md → Machine). Check with `node -v` (expect `v26.13.1`) and `pnpm -v` (expect `12.23.0`). Inside the repo a different pnpm stops with an error (`devEngines.packageManager.onFail: "error"`, the maintainer's choice), so install the pinned version globally (`npm install -g pnpm@<version>`) and `pnpm -v` there shows it.

- **How it's set up** (Node manager, its paths, where pnpm is installed, the pnpm store) is per machine: local.md → Machine. If local.md doesn't say, ask the user rather than guess.
- **The desktop app sees a private copy of `AppData`.** The Claude desktop app is a packaged Windows app, so Windows gives it its own copy of the user's `AppData` folders, on every drive. So keep Node versions and any global tools out of `AppData` (or agent shells won't find them), and:
  - a Node manager whose own executable is under `AppData` (nvm-windows by default) isn't available in agent shells. That's expected, and nothing needs it.
  - anything you change or delete under an `AppData` path only touches the app's copy, not the user's real files.
- **Changing Node version:** the user switches Node in their own terminal (section 3; with nvm-windows, `nvm install <version>; nvm use <version>`, and `nvm use` may show a Windows admin prompt). Run `npm install -g pnpm@<version>` afterwards, from an agent shell or a **new** terminal tab: the tab that ran `nvm use` still has the old Node path cached and says `npm` isn't recognised. Then bump `.nvmrc`, `engines` and the versions in SKILL.md and this file together. For pnpm, install the new version globally first (`npm install -g pnpm@<version>`), then `pnpm self-update <version>` in the repo writes all three of its pins at once: `packageManager`, `devEngines.packageManager.version` and the lockfile's first document. Bumping one alone stops every pnpm command (`onFail: "error"`). `self-update` also installs that pnpm under `PNPM_HOME` (`AppData\Local\pnpm`: `bin` and `global\v11`; from the desktop app, its private copy), later on PATH than the global one, where it would silently stand in for a missing global pnpm after a later Node switch: delete those two folders afterwards (never `store` or `package-manager-store`, the package store installs use).
- Ignore pnpm's "Update available" notice (the version is pinned) and npm's warning that pnpm's install scripts aren't allowlisted.

## 2. Dependencies

- `pnpm install` (or `pnpm add <pkg>` / `pnpm add -D <pkg>`). It first verifies the lockfile against supply-chain policies, and can sit at "Progress: resolved 0" for a few minutes. That's normal; wait before deciding it has hung.
- **`ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR` / "Access is denied"**: pnpm wanted to rebuild `node_modules` while something held a file open, and may have deleted **part** of it. Re-run the same command. If it keeps failing, ask the user to close anything using the project (editor language servers, a running Vitest UI or watch build) rather than killing processes yourself.
- **`ERR_PNPM_UNSUPPORTED_ENGINE`** after a dependency update: `engineStrict` makes dependencies' own `engines` ranges strict too, not only ours, so the new version may want another Node.
- Check: `node_modules/.pnpm` exists and `pnpm list <pkg>` shows the version.
- **Re-resolving the lockfile from scratch** (a removed package still resolved as some dependency's optional peer, say): save a copy of `pnpm-lock.yaml`, then delete it **and** `node_modules/.pnpm/lock.yaml` (with only the first gone, pnpm rewrites the lockfile from what's installed) and run `pnpm install`. The lockfile is two YAML documents: the first (`packageManagerDependencies`) pins pnpm itself, and a fresh resolve writes only the second, so put the first back from the copy, unchanged, above the new one's `---`. Then `pnpm install --frozen-lockfile` must pass (as CI runs it), and list which packages changed version: dependencies move within their ranges.
- **The editor's TypeScript link:** `postinstall` (`build/link-editor-tsdk.ts`) links `node_modules/.tsrs-tsdk` to the folder holding tsrs's language server for this platform (Windows: tsrs's native package; elsewhere `tsrs/tsdk`), which `.vscode/settings.json` points VS Code's TypeScript 7 extension (`TypeScriptTeam.native-preview`) at. pnpm runs `postinstall` on a fresh install only, not when `node_modules` is already up to date or on `pnpm add`, and the link survives those. If it's missing (VS Code says it can't find the TypeScript 7 SDK), run `node build/link-editor-tsdk.ts`; it only warns on a problem, so an install never fails over it.
- **Checking VS Code runs tsrs:** after a window reload, a `tsgo` process whose parent is `Code.exe` (`Get-CimInstance Win32_Process -Filter "Name='tsgo.exe'"`, and its `ParentProcessId`) is tsrs: the TypeScript 7 extension's own bundled TypeScript is `tsc.exe`. Windows hides the process's path from an unelevated shell, so tell by the name.

## 3. Fallback: the user's terminal

Normal work doesn't need it. Use the user's own terminal (`run_in_terminal`) only for things that must change their real environment: nvm, Node versions, global installs, anything under `AppData` (section 1). Changes to their toolchain need their go-ahead first.

- It only takes literal command lines (no variables, pipes or parentheses). Put anything more complex in a `.ps1` in the scratchpad and run that with `& '<path>'`.
- Send output to a scratchpad log (`<command> *> <scratchpad>\x.log; echo DONE`) and read the log; the screen only shows the last lines.
- At most 6 agent-opened tabs at a time: close finished ones with `stop_terminal_tab` (`close: true`).

Once `node -v` and `pnpm -v` look right and `node_modules` is installed, everything else is in [SKILL.md](SKILL.md).
