# [Unofficial Addon] Trueachievements Extra 
This is a unofficial addon for Trueachievements, this addon requires [Tampermonkey](https://www.tampermonkey.net/). 

## Installation
Requires: [Tampermonkey](http://tampermonkey.net/)

1. Navigate to the dist folder,
2. Open `trueachievements-extras.min.user.js` (Minified version),
3. Click "Raw" and Tampermonkey will prompt script installation

# Developer Guide
Requires: [Node](https://nodejs.org/en/), [Tampermonkey](http://tampermonkey.net/) and a code editor such as [Visual Studio Code](https://code.visualstudio.com/) or any alternative.

## Developing
- `npm i`
- `npm i --only=dev` (If you have issues with packages being missing.)
- `npm start`

Install `trueachievements-extras.dev.user.js` from dist and add it to Tampermonkey, this will fetch the userscript from your local machine.
This requires Tampermonkey to be gave the "Allow access to file URLS" permission on chrome.

### Versioning
This should be done at the point of creating a release. Version the package.json, ensuring to comply with [semver](http://semver.org/) (MAJOR.MINOR.PATCH)

- `git remote update`
- `git pull --rebase origin master`
- Either `npm version patch` | `npm version minor` | `npm version major`
- `npm run build`
- `git push --force origin <branch>`

## Installation
Requires: [Tampermonkey](http://tampermonkey.net/)

1. Navigate to the dist folder,
2. Open `trueachievements-extra.min.user.js` (Minified version) or `trueachievements-extra.min.user.js` (non-minified version),
3. Click "Raw" and Tampermonkey will prompt script installation
