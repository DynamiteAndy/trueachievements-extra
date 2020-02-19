# [Unofficial Addon] Trueachievements Extra 
This is a unofficial addon for Trueachievements, this addon requires [Tampermonkey](https://www.tampermonkey.net/). 

## Installation
Requires: [Tampermonkey](http://tampermonkey.net/)

1. Navigate to the dist folder,
2. Open `trueachievements-extras.min.user.js` (Minified version),
3. Click "Raw" and Tampermonkey will prompt script installation


# Developer Guide
## Developing
- Create `config.js` for [tamperdav](https://github.com/Tampermonkey/tamperdav#config-file-example) & configure Tampermonkey Script Sync Settings for local development.
- `npm i`
- `npm i --only=dev` (If you have issues with packages being missing.)
- `npm start`

Requires: [Node](https://nodejs.org/en/), [Tampermonkey](http://tampermonkey.net/) and a code editor such as [Visual Studio Code](https://code.visualstudio.com/), [Atom](https://atom.io/) or any alternative.

### Problem Solving
##### Tampermonkey is not automatically syncing the changes from my local to my browser?
If the browser is opened before tamperdav is running, manual syncing is required and can be done by selecting the "Check for userscript updates" menu item in the Tampermonkey dropdown, to renable auto sync the solution is to close the browser, rerun `npm start`.

### Gulp Tasks
`lint:html`
Style guide for html.

`lint:js`
Style guide for js.

`lint:styles`
Style guide for scss/sass.

`build:styles`
Compiles the scss/sass into a single css file.

`build:dev`
Compiles the scripts, views and compiled css into a single script, whilst making changes to the header files name, version, author, description, updateURL and downloadURL lines. The compiled script will be copied across to the tampermonkey folder and replace the existing to sync to the browser.

`build:prod`
Compiles the scripts, views and compiled css into a single minified script, whilst making changes to the header files version, author and description.

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
