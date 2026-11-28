# [Unofficial Addon] TrueAchievements Extra 

[![Latest Version](https://img.shields.io/github/v/release/DynamiteAndy/trueachievements-extra)](https://github.com/DynamiteAndy/trueachievements-extra/releases/latest)
[![codecov](https://codecov.io/gh/DynamiteAndy/trueachievements-extra/graph/badge.svg?token=27NBZX1HL4)](https://codecov.io/gh/DynamiteAndy/trueachievements-extra)
[![Github Actions](https://github.com/DynamiteAndy/trueachievements-extra/actions/workflows/ci.yml/badge.svg)](https://github.com/DynamiteAndy/trueachievements-extra/actions/workflows/ci.yml)
[![AI Assisted](https://www.aihonestybadge.com/badges/ai-assisted-small.svg)](https://www.aihonestybadge.com)

This is an unofficial addon for TrueAchievements, this addon requires [Tampermonkey](https://www.tampermonkey.net/). 

## Installation
Requires: [Tampermonkey](http://tampermonkey.net/)

Open [trueachievements-extras.min.user.js](https://github.com/DynamiteAndy/trueachievements-extra/releases/latest/download/trueachievements-extras.min.user.js) (minified) or [trueachievements-extras.user.js](https://github.com/DynamiteAndy/trueachievements-extra/releases/latest/download/trueachievements-extras.user.js) (readable) and Tampermonkey will prompt you to install it. Every version, with what changed in it, is on the [Releases page](https://github.com/DynamiteAndy/trueachievements-extra/releases).

# Developer Guide
Requires: [Node](https://nodejs.org/en/) at the version in `.nvmrc`, [pnpm](https://pnpm.io/) at the version in `package.json`'s `packageManager`, [Tampermonkey](http://tampermonkey.net/) and a code editor such as [Visual Studio Code](https://code.visualstudio.com/) or any alternative.

## Developing
- `pnpm i`
- `pnpm start` (builds the dev script and rebuilds it on every save), or `pnpm run build:dev` for a one-off build

Checks (CI runs both, then the prod build, on pull requests and pushes to `main`):
- `pnpm run lint` (formatting, lint and the type check)
- `pnpm vitest run` (all the specs; `--project pure`, `page` or `repo` for one group)

Install `trueachievements-extras.dev.user.js` from dist and add it to Tampermonkey, this will fetch the userscript from your local machine.
This requires Tampermonkey to be given the "Allow access to file URLs" permission on chrome. Only one copy of the script runs on a page: the first to start, in Tampermonkey's order. So put the dev script above the release one, or disable the release script; a dev build that starts second says so in a toast.

### Versioning
To release, bump the version in package.json in your pull request, complying with [semver](http://semver.org/) (MAJOR.MINOR.PATCH). The release scripts in dist and the `v<version>` tag are automatic: CI builds dist and commits it to the pull request, and tags the version once it's merged into main. Don't build or commit dist yourself.

```text
Pull request bumps the version in package.json
 │
 ▼
Build Release Dist: build job (read-only token)
 ├─ version unchanged ───────────────────────────► nothing to build
 ├─ version already tagged ──────────────────────► fails: bump to a version not released yet
 └─ pnpm run build:release, dist/*.js kept as an artifact
     │
     ▼
Build Release Dist: publish job (write token, runs no project code)
 ├─ artifact isn't just the two release scripts ─► fails, committing nothing
 ├─ scripts unchanged ───────────────────────────► nothing to commit
 └─ commits them to the branch, starts CI on that commit
     │
     ▼
CI passes, merged into main ─────────────────────► users get the update (Tampermonkey reads dist on main)
 │
 ▼
Tag Release: check job (read-only token)
 ├─ version already tagged ──────────────────────► nothing to release
 ├─ dist doesn't match a fresh build:release ────► fails without tagging: bump again in a new pull request
 └─ dist matches
     │
     ▼
Tag Release: tag job (write token, checks out nothing)
 └─ tags the commit v<version>
```

Only the jobs that write hold a write token, and they run none of the project's code (no install or build), so nothing a dependency runs can push. On the dist commit, the pull request's own workflows show as waiting for approval: leave them, as CI has already been started there (a cleanup job deletes them).
