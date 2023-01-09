# Changelog

## 2.3.1
- Fix the janky timymce editor if sticky header was enabled,
- Fix clickable table links not working if there was no achievements in the table,
- Fix the code button on the tinymce editor looking weird,
- Fix the floating menus on the tinymce editor being janky

## 2.3.0
- Added a code view to the tinymce editor.

## 2.2.1
- Fixed another issue where some walkthrough elements would not follow the tinymce theme,
- Add a autosave notification on edit walkthrough,
- Fixed a bug with auto select first where it would auto select the first even if a walkthrough was selected,
- Fixed a bug with auto select first (it was checking the wrong setting was enabled, sorry)!

## 2.1.2
- Fixed an issue where some walkthrough elements would not follow the tinymce theme. 

## 2.1.1
- Fancy new settings menu with accordions to clean up the settings,
- Moved injected html to handlebars templates,
- Minify html and css further reducing package size (?),
- Split out all features into own files instead of 1 file with many features,
- Added a new feature to change the locked message on walkthrough page to be more clear,
- Added a changelog view for the past 5 versions and a credits area,
- Added a new feature to auto select the first walkthrough on manage walkthrough.

## 2.0.1
- Fixed test runner not reporting correctly,
- Fixed a bug with improved image loader not working if there was alot of images.

## 2.0.0
- Moved from gulp and browserify to webpack, considered breaking as its a change to how the script is compiled.

## 1.5.1
- Fixed caching by days, it was caching by seconds instead >_<.

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