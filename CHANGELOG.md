# Changelog

## 2.0.1
- Fixed test runner not reporting correctly
- Fixed a bug with improved image loader not working if there was alot of images

## 2.0.0
- Moved from browserify to webpack, considered breaking as its a change to how the script is compiled.

## 1.5.1
- Fixed caching by days, it was caching by seconds instead >_<

## 1.5.0
- Fixed an issue where clickable table links would only make a single achievement clickable if it was duplicated.
- Removes any duplicate achievements on manage walkthrough and combines page numbers together.
- Added error handling for if a walkthrough has previously been selected but is no longer selected after "being improved" is checked.
- Added a button to the tiny mce editor to allow theme switching at a iframe level instead of a site wide level.

## 1.4.0
- Cleaned up regex to be more reuseable,
- Adds a feature to walkthrough clickable links for achievements
- Adds a feature to walkthrough clickable links to update total records with out of X achievements
- Refactored staff walkthrough improvements to be seperated scripts instead of one massive one,
- Bug fix for tinymce theme not working correctly due to theme being undefined,
- Bug fix for back to management button causing default status to trigger,
- Added auto clear for memoized fetches,
- Added logging.

## 1.3.0
- Adds a feature to make the game, gamers and achievements on manage walkthrough clickable links,
- Bug fix for sticky page history event listener still getting added,
- Bug fix for improved image selector breaking if there is no images

## 1.2.0
- Adds a dark mode tinymce theme for edit walkthrough,
- Improves the image selector on edit walkthrough.

## 1.1.0
- Adds a feature to select the default status on manage walkthrough.

## 1.0.2
- Bug fix for being improved checkbox breaking the manage walkthrough page layout.

## 1.0.1
- Bug fix for sticky page history sticking too early.

## 1.0.0
- Inital release.