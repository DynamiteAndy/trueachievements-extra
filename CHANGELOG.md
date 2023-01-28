# Changelog

## 2.9.0
- Changes default game status so it will not change state for 100% achievements,
- Adds emojis for replies,
- Fixes styles on settings menu for light mode users ([ManicMetalhead](https://www.trueachievements.com/gamer/ManicMetalhead) comes to mind).

## 2.8.0
- Fixed walthrough preview caching, changed it to 4 hours instead of 7 days,
- Tweaked some styles on the homepage relating to highlighted articles,
- Added support for "Ready for Review" walkthroughs with sidebar content,
- Adds a new feature to select default values for game clips.

## 2.7.0
- Adds a feature to auto select a default achievement state on a game,
- Adds a feature to populate the walkthrough preview sidebar content.

## 2.6.1
- Fixed a bug with the settings not expanding correctly,
- Adds a feature to readd the missing buttons when adding a new page on manage walkthrough,
- Adds a feature to add highlight missing games from collection on games list (Credit to [Belindo152](https://www.trueachievements.com/gamer/Belindo152)),
- Adds a feature to group achievements by game to gamer achievements (Credit to [Belindo152](https://www.trueachievements.com/gamer/Belindo152)),
- Adds a feature to auto sort sale article tables by column,
- Adds a credits section to the changelog view,
- Redesign the settings menu,
- Fixed a error thrown when adding a page on manage walkthrough.

## 2.5.0
- Adds a feature to keep the sticky header stuck.

## 2.4.3
- Fix resizing issue at 1350px.

## 2.4.2
- Fix binding on clearing expired cache,
- Fix version text moving inline on the menu.

## 2.4.1
- Fix in progress walkthroughs only showing on inital load,
- Delete left overs from legacy cached items.

## 2.4.0
- Fix the red background on achievements on the walkthrough editor,
- Adds a new feature for forums, walkthrough forums will now show progress, editors and likes.

## 2.3.1
- Fix the janky timymce editor if sticky header was enabled,
- Fix clickable table links not working if there was no achievements in the table,
- Fix the code button on the tinymce editor looking weird,
- Fix the floating menus on the tinymce editor being janky.

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