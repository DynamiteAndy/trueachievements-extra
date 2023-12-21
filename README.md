# [Unofficial Addon] Trueachievements Extra 

[![Latest Version](https://img.shields.io/github/package-json/v/DynamiteAndy/trueachievements-extra)](https://github.com/DynamiteAndy/trueachievements-extra/raw/main/dist/trueachievements-extras.min.user.js)
[![codecov](https://codecov.io/gh/DynamiteAndy/trueachievements-extra/graph/badge.svg?token=27NBZX1HL4)](https://codecov.io/gh/DynamiteAndy/trueachievements-extra)
[![Github Actions](https://github.com/DynamiteAndy/trueachievements-extra/actions/workflows/lint-and-test.yml/badge.svg)](https://github.com/DynamiteAndy/trueachievements-extra/actions/workflows/lint-and-test.yml)

This is a unofficial addon for Trueachievements, this addon requires [Tampermonkey](https://www.tampermonkey.net/). 

## Installation
Requires: [Tampermonkey](http://tampermonkey.net/)

1. Navigate to the dist folder,
2. Open `trueachievements-extras.min.user.js` (Minified version),
3. Click "Raw" and Tampermonkey will prompt script installation

# Developer Guide
Requires: [Node v20 or higher](https://nodejs.org/en/), [pNpm](https://pnpm.io/), [Tampermonkey](http://tampermonkey.net/) and a code editor such as [Visual Studio Code](https://code.visualstudio.com/) or any alternative.

## Developing
- `pnpm i`
- `pnpm start`

Install `trueachievements-extras.dev.user.js` from dist and add it to Tampermonkey, this will fetch the userscript from your local machine.
This requires Tampermonkey to be gave the "Allow access to file URLS" permission on chrome.

### Versioning
This should be done at the point of creating a release. Version the package.json, ensuring to comply with [semver](http://semver.org/) (MAJOR.MINOR.PATCH)
