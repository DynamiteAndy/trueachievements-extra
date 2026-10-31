# Changelog

## 4.0.0
- Updated the script to install and update from GitHub Releases, where every version is now listed with its notes,
- Renamed the settings tabs to General, Forums, Gamer, Games, News and Staff, and settings to say what they do: Collapsible Groups (achievements and DLC), Hide Threads By Keyword, Show Walkthrough Information (in Walkthrough Threads), Highlight Progress On Hover, Default Filters (clips), Default Sort (sales), Show XboxAchievements.com / PlaystationTrophies.org / GamertagNation.com Guides, Add Not In Collection Button, More Emojis, Show Autosave Notifications, Stick Page History To The Left, Highlight Page Locked Message and Fill In Side Column, and the keyword lists' button to Add Keyword,
- Added the Extra Guides section to a game's DLC pages, and moved the guide sites' settings into their own Extra Guides group, last in the Games tab, whose groups now follow the order of a game's own tabs,
- Updated how your settings are stored, moving them over the first time 4.0.0 runs, so you keep every setting, including ones saved by much older versions,
- Added support for importing guides from PlaystationTrophies, with several guide links per game,
- Added support for importing guides from Gamertag Nation,
- Added Gamertag Nation guide icons,
- Added expandable and collapsible game and DLC achievement groups,
- Added expandable and collapsible sale groups,
- Added options to hide owned games from sales,
- Added options to hide games with unobtainables from sales,
- Added labelling your wishlist's games and DLC in sales, and optionally the editions, bundles and passes that include them,
- Added auto opt in to the daily giveaway,
- Added hoverable paragraphs to walkthroughs, highlighting your progress,
- Added hiding the empty ad rows TA Pro leaves in sale tables,
- Added changing the walkthrough a walkthrough thread is linked to, with its pencil in Walkthrough Information,
- Added Show Walkthrough Information remembering a walkthrough's thread when you visit the walkthrough, so the thread shows it straight away,
- Added Fit Menus To Window to Sticky Header, adding columns to the header's menus when they're too tall for the window, up to three, narrowing them to what their links need to fit more, and scrolling the menu when even that isn't enough,
- Added a Controller tab to the emoji picker with the site's controller buttons, in place of the site's own controller button,
- Updated the settings menu to use tabs instead of dropdown sections,
- Updated most settings, Sticky Header, Stick Page History To The Left, Move Buttons To The Left and Improved Image Selector included, to apply straight away, without reloading the page; turning one off puts the page back as it was,
- Fixed Sticky Header leaving an empty bar at the top of the page when the page, rather than you, scrolled back to the top: it now comes back, and its space shows in the header's colour while it's away,
- Fixed Sticky Header sliding out of view, with the menu, when you scrolled while one of the header's menus (Gaming, Community, My Links) was open,
- Fixed Sticky Header sliding the wrong way when the header changed height just after you scrolled,
- Fixed Sticky Header sliding into view at the end of a short walkthrough page when you scrolled there in one go,
- Fixed Sticky Header staying in view after your first scroll down from the top of a page, when that scroll jumped past it in one go,
- Fixed Sticky Header not coming back on your first scroll up after reloading a page part way down,
- Fixed the walkthrough editor's open menus falling behind its toolbar while the header slid in or out,
- Fixed the walkthrough editor's improvements sometimes not showing when the page was still loading as the script started,
- Updated the settings menu's reload message to say only when a reload is needed, and that default filters apply the next time you open the page,
- Updated the settings menu's lines to follow the site's own menus: a line under every option and group header, none within a group an option opens and none under a tab's last option,
- Updated the settings menu's option names to be shorter where their group already names them, and labelled the Clips and Default Sort dropdowns,
- Fixed the Feature Documentation's guides section running past the edge of the settings menu, and spaced its paragraphs apart,
- Fixed the settings menu's last options hiding under its footer in a short window, with no scrollbar to reach them,
- Updated the Feature Documentation to follow the settings menu's order, with a section to open for each of its tabs,
- Updated the settings menu to keep its options in place when switching between tabs, and to give the keyword lists' Add Keyword button the menu's button look,
- Updated the guide sites' settings to a shorter description,
- Updated the settings menu's grouped options, such as Remain Stuck and the options each Override shows, to sit right under the option they belong to,
- Updated Group By Game to put the achievement list back in the site's order when the setting is turned off,
- Updated Default Thread Type to point links to a game's forum at your default tab, so the forum opens on it straight away,
- Updated Clickable Table Links on the manage walkthrough page to apply straight away, without reloading the page; turning it off puts the tables back as they were,
- Updated the walkthrough preview's side column to show a walkthrough's latest pages, thanks and achievements after you change it on its manage page or walkthrough page, rather than up to 4 hours later; just looking (a visit, sorting, filtering or picking a walkthrough) keeps them,
- Updated the settings menu, tabs, expandable groups and hide buttons to work with the keyboard and screen readers: Tab to them, Enter or Space to use them, arrow keys between tabs, and Escape to close the settings menu; the settings menu's toggles can be reached with Tab, focus rings show on tabs, the close button and the guides' video play button, every dropdown, Remove link, leaderboard link, collapse button and hide toggle has a name of its own, Tab skips hidden sale rows' links, and the guide and walkthrough link forms keep the keyboard's place, with imports read out,
- Updated the walkthrough editor's text colour buttons to work like TinyMCE's own: picking a colour closes the panel, and the button re-applies the last colour picked,
- Updated the walkthrough editor's Text color and Background color menus to a colour picker, keeping the site's colours as swatches, named and pickable from the keyboard, and No color as their last box, opened under the toolbar when it's stuck,
- Updated the walkthrough editor's table colour pickers to offer the same colours as swatches, and to look like the editor's menus in the light and dark editor,
- Fixed the walkthrough editor's menus sometimes opening far below its toolbar when the editor finished loading before its toolbar was laid out,
- Fixed the walkthrough editor's Paragraph menu keeping the old theme's colours on its options after switching theme, until the page was reloaded,
- Fixed the walkthrough editor's Select all button having no icon,
- Fixed the walkthrough editor briefly showing white as the edit page loads in the dark theme,
- Updated the walkthrough editor's table colour pickers to close with the Table properties dialog: closing it with Escape left an open picker on screen,
- Updated the walkthrough editor to follow a theme picked in another tab's editor,
- Updated the dark walkthrough editor's buttons and fields to lighter text,
- Updated the walkthrough page's Back to management button to show its tooltip over its text too, as the site's own does,
- Updated Sticky Header to slide into view when the keyboard moves into it, and to keep a focused control or an anchor's target from landing under it,
- Updated toasts to stay while your pointer or the keyboard is on them,
- Updated Improved Image Selector to close on Escape, or when the keyboard moves out of it,
- Updated the slides, expandable groups and tab bars to jump into place instead of moving when your system asks for reduced motion,
- Updated turning off Add Not In Collection Button to give the games list its row striping back,
- Updated Clips' Default Filters to set all of its filters in one page load, instead of one load per filter,
- Updated 360Achievements guides to XboxAchievements and refreshed guide links,
- Updated imported guide storage to use IndexedDB,
- Updated imported guides to be forgotten, once a day, for guide pages you visited but no game links, so they no longer pile up,
- Updated guide importing to say when an import is still running after 30 seconds: check the guide tab, or open the guide page yourself and close that tab,
- Updated pages the script reads from other pages to be kept for a day instead of a week, so progress counts and owned items stay current, and refreshed when you visit one showing its full list,
- Updated guide management with editable linked guide pages,
- Updated guide links saved by earlier versions to the same form as new ones, so adding a page that is already linked is spotted, and removing a link keeps the guides another game still links,
- Updated imported guides to show in a fixed order: XboxAchievements, PlaystationTrophies, then Gamertag Nation,
- Updated imported guides' YouTube videos to name themselves to screen readers once playing,
- Updated the Extra Guides section to show its guide sites as tabs across its top,
- Updated walkthrough previews with navigation, statistics, and achievement links,
- Optimised assets and styles to reduce package size,
- Removed the progress circle from Show Walkthrough Information,
- Removed background requests to external sites,
- Fixed the empty "How to unlock" heading staying on an achievement page after its last imported guide was turned off,
- Fixed the emoji button's smiley looking thinner than the site's own,
- Fixed XboxAchievements guide importing,
- Fixed imported XboxAchievements guides being added to the page without being cleaned first,
- Fixed Remain Stuck staying on after being turned off,
- Fixed walkthrough games with the same name all linking to the first one on the manage walkthrough page,
- Fixed Clickable Table Links on the manage walkthrough page using the games and editors from before a change made there,
- Fixed the manage walkthrough page's Add page, View public page, Preview, View and edit content and Clear Cache going missing when the page was slow to load: the site's Action menu now stays until they're in the buttons row,
- Fixed the manage walkthrough page sometimes leaving an achievement guided on several pages listed more than once on a long walkthrough, with the list's total not corrected,
- Fixed Auto Select First Walkthrough sometimes picking the first walkthrough of the whole list rather than of your Default Status's list,
- Fixed Improved Image Selector staying open when you clicked an icon, such as the settings menu's wrench,
- Fixed the tab bars (the settings menu, the emoji picker and Extra Guides) scrolling when dragged with the right or middle mouse button,
- Fixed Show Walkthrough Information following a thread's link to another site,
- Fixed the manage walkthrough page's side panels sitting below the others, and its extra buttons having no spacing,
- Fixed secret achievements the site hides from you not showing their imported guide, and their guide section loading 10 seconds late,
- Fixed the settings menu waiting 10 seconds to appear when the site's gamer panel fails to load,
- Fixed guide links being accepted by the wrong importer,
- Fixed Group By Game putting a game whose name starts in lower case or with an accent after every other game; games now sort alphabetically,
- Fixed a broken achievement link on a guide page stopping that page's guides being imported; its guide now links to the guide page,
- Fixed missing achievements in walkthrough previews,
- Fixed walkthrough previews showing the page's own game and pages after typing a different walkthrough id,
- Fixed the walkthrough preview's side column disappearing when the walkthrough id typed in wasn't found: it now says so and asks again, and spaces around the id are ignored,
- Fixed an error when saving something that isn't a web address as a guide link,
- Fixed the giveaway auto opt-in entering the same giveaway again on every page if the site stops marking it entered,
- Fixed walkthrough previews loading forever for walkthroughs you can no longer access; they now hide the extra side sections,
- Fixed the giveaway auto opt-in entering the same giveaway more than once when several tabs open together,
- Fixed everything running twice when both the readable and minified scripts are enabled: only the first to start runs,
- Fixed the script showing the last account's pages (the walkthrough team's lists, the giveaway) after another account signs in on the same computer: its saved pages are now cleared when the signed-in account changes,
- Fixed Show Progress As XX/XX and Collapsible Groups asking for a reload when changed on a game without DLC; they now apply straight away,
- Fixed Default Thread Type switching away from the tab a link opened the forum on; it now applies only when no tab is named,
- Fixed Individual Progress showing out-of-date counts on a game set to Not Won (a game set to Won is now read without a fetch),
- Fixed Show Walkthrough Information refusing a walkthrough link without the site's address (e.g. `/game/<name>/walkthrough`), and accepting a link to another site,
- Fixed the Extra Guides section not showing when its stored guides can't be read,
- Fixed a broken guide import stopping the guides imported after it from being saved,
- Fixed gamer menu alignment on smaller screen sizes,
- Fixed settings sections occasionally clipping the last option,
- Behind the scenes, migrated from Handlebars templates to Preact,
- Behind the scenes, migrated from Jest to Vitest,
- Behind the scenes, migrated from JSDOM to Happy DOM,
- Behind the scenes, migrated from Webpack to Rspack,
- Behind the scenes, migrated from ESLint to Oxlint,
- Behind the scenes, migrated from Prettier to Oxfmt,
- Behind the scenes, releases are now built and published to GitHub Releases automatically once a version bump is merged,
- Behind the scenes, updated dependencies, GitHub Actions, and Node.js.

## 3.1.2
- Updated Emojis to load faster, and to also appear on reply boxes that load after the page,
- Fixed Improved Image Selector not working when the site gave its image viewer a stray space in its id,
- Updated the wording on Xbox Achievement Guides to link to XboxAchievements.com,
- Behind the scenes, more tests, a codecov setup, GitHub issue templates and package updates.

## 3.1.1
- Updated urls to point at the new repo.

## 3.1.0
- Added text colour and background colour buttons to the walkthrough editor,
- Added workarounds for missing buttons (Controller Buttons + Xbox Image) on the walkthrough editor,
- Fixed Show progress as XX/XX not working correctly on the achievements page,
- Fixed Xbox Achievement Guides fetching a guide on the achievements page instead of the individual achievement page,
- Fixed the colour picker (JSColor) not showing on Table properties after the first time it was opened,
- Fixed Owner Progress on forum walkthrough threads reading the wrong text in some cases,
- Fixed an issue where if an element was null and waited on, it would never resolve,
- Fixed some async stuff,
- Behind the scenes, unit tests galore!,
- Behind the scenes, moved from Jasmine to Jest,
- Behind the scenes, removed dependency on sass-to-string.

## 3.0.0
- Added a link to the leaderboard on each achievement's progress bar on the achievements, challenges and DLC pages (not on mobile),
- Fixed Xbox Achievement Guides not working anymore, guides are now fetched through Tampermonkey instead of a third party proxy,
- Fixed Xbox Achievement Guides showing on the gamer leaderboard for an achievement,
- Fixed the DLC features also running on a DLC's difficulty and completion time pages,
- Fixed walkthrough preview aside content not loading,
- Fixed some mobile/tablet sizing issues,
- Behind the scenes, changed from ts-loader to esbuild-loader,
- Behind the scenes, finally got the vscode debugger working,
- Behind the scenes, set up GitHub Actions to commit dist and push tags,
- Behind the scenes, updated to the latest node.

## 2.13.0
- Added a feature to select a default game forum thread,
- Added a feature to include guides from [XboxAchievements](https://www.xboxachievements.com/) on achievement guide pages,
- Updated Emojis to compress the emoji json, reducing the package size,
- Removed some unused Emoji json properties to reduce the package size,
- Behind the scenes, moved from stylelint to prettier for hbs, html and scss.

## 2.12.1
- Fixed body resizing when at 1199px, a random grey bar won't appear on the right anymore,
- Fixed the header not resizing when at 767px,
- Fixed the thread filter not working on game forums.

## 2.12.0
- Added a feature to filter game threads, my threads and forum threads by keywords.

## 2.11.1
- Added support for emojis in private messages,
- Added support for emojis in game comments,
- Added support for JSColor on Edit Walkthrough Table properties,
- Updated the Walkthrough Team button on the walkthrough page to read "Back to management", and it will only show if that button is not already showing,
- Fixed emojis missing all the TrueAchievement emotes,
- Fixed Manage walkthrough buttons appearing in wrong place.

## 2.10.1
- Fixed base game being excluded from Show progress as XX/XX,
- Fixed filter by walkthrough status resetting to default,
- Fixed default dlc status constantly being applied.

## 2.10.0
- Added support for "Ready for publish" walkthroughs with sidebar content,
- Added a feature to games and dlc to show progress as XX/XX instead of XX,
- Updated the achievement based features to include dlc pages,
- Updated the achievement based features to include challenge pages,
- Added a documentation view for detailing features,
- Updated some styling around credits, changelog and documentation,
- Fixed the paragraph menu not showing correctly on the edit walkthrough page,
- Behind the scenes, refactored svgs to be more reusable.

## 2.9.0
- Updated Default Status for Game Achievements so it will not change the status when you have 100% of the achievements,
- Added a new Emojis feature that adds an emoji picker to the reply box, with the TrueAchievements emotes and the standard emojis in tabs,
- Fixed styles on the settings menu for light mode users ([ManicMetalhead](https://www.trueachievements.com/gamer/ManicMetalhead) comes to mind).

## 2.8.0
- Fixed walkthrough preview caching, changed it to 4 hours instead of 7 days,
- Updated some styles on the homepage relating to highlighted articles,
- Added support for "Ready for review" walkthroughs with sidebar content,
- Added a feature to select default values for game clips.

## 2.7.0
- Added a feature to auto select a default achievement state on a game,
- Added a feature to populate the walkthrough preview sidebar content.

## 2.6.1
- Fixed a bug with the settings not expanding correctly.

## 2.6.0
- Added a feature to readd the missing buttons when adding a new page on manage walkthrough,
- Added a feature to highlight games missing from your collection on the games list (Credit to [Belindo152](https://www.trueachievements.com/gamer/Belindo152)),
- Added a feature to group achievements by game on gamer achievements (Credit to [Belindo152](https://www.trueachievements.com/gamer/Belindo152)),
- Added a feature to auto sort sale article tables by column,
- Added a credits section to the changelog view,
- Updated the settings menu with a new design, each feature group (Forum, Gamer, Games, News and Staff Walkthrough Improvements) is now a collapsible section with its own on/off switch,
- Fixed an error thrown when adding a page on manage walkthrough.

## 2.5.0
- Added Remain Stuck to Sticky Header, keeping the header in view as you scroll instead of hiding it when you scroll down.

## 2.4.3
- Fixed the site's page width jumping at window widths around 1350px.

## 2.4.2
- Fixed expired cached pages no longer being cleared since 2.4.1 (it failed with an error when the script started),
- Fixed the settings menu's version number moving onto the same line as the script's name.

## 2.4.1
- Fixed Show Owner/Progress only showing an in-progress walkthrough's progress the first time its thread loaded; on later visits the section stayed empty,
- Updated the script to delete the old cached data left behind by earlier versions.

## 2.4.0
- Added Forum Improvements, with a Walkthroughs group and a Show Owner/Progress setting: on a walkthrough thread in the Walkthroughs forum, a Walkthrough Information section shows the walkthrough's progress while it's in progress, or its editors and thanks once published,
- Added remembering a walkthrough's thread-to-walkthrough link: when the page can't be found automatically, paste the walkthrough page's link once and it's saved for that thread,
- Fixed the red background on the walkthrough editor's floating menus,
- Behind the scenes, replaced the event system and the HTML minifier.

## 2.3.1
- Fixed the walkthrough editor's sticky toolbar jumping about when Sticky Header was turned on,
- Fixed Clickable Table Links on the manage walkthrough page doing nothing when the walkthrough had no achievements yet,
- Fixed the walkthrough editor's Show Code button looking misaligned,
- Fixed the walkthrough editor's open menus being left out of place after the toolbar moved while scrolling,
- Behind the scenes, moved to pnpm and updated packages.

## 2.3.0
- Added a Show Code button to the walkthrough editor's toolbar, opening a Source code dialog to edit the walkthrough's HTML,
- Behind the scenes, moved the walkthrough editor's toolbar changes into their own folder.

## 2.2.1
- Updated the walkthrough editor's toolbar, when it sticks to the top of the window as you scroll, to span the editor's full width and to sit below Sticky Header when that is on,
- Updated the walkthrough editor's drop-down menus (such as Text color) to open just below the toolbar while it is stuck,
- Updated Sticky Header's description to say it may cause some sticky elements to look buggy,
- Fixed the settings menu's expandable sections not resizing when an option inside them showed or hid another option,
- Fixed changes to most settings being lost on the next page load since 2.1.1 (Staff Walkthrough Improvements and its Stick Page History To Left, Add Walkthrough Team Button, Improved Image Selector, Clickable Table Links and Default Status options, and the editor's theme choice),
- Behind the scenes, Stick Page History To Left now uses the same sticky code as the editor's toolbar.

## 2.2.0
- Added Auto Save Notifications to Staff Walkthrough Improvements' Edit Walkthrough options, showing a message when the walkthrough editor's autosave succeeds or fails,
- Fixed the walkthrough editor's dialogs and drop-down menus staying light in its dark theme, and its toolbar following the site's theme instead of the editor's theme switch,
- Fixed Auto Select First Walkthrough following the Default Status for Manage Walkthrough setting instead of its own, so it ran whenever Default Status was on and never on its own,
- Fixed Auto Select First Walkthrough selecting the first walkthrough even when one was already selected,
- Behind the scenes, console logging is removed from the built script.

## 2.1.1
- Added a Highlight Page Locked setting to Staff Walkthrough Improvements' Walkthrough Page options, showing the "page locked" message as an information panel so it stands out,
- Added an Auto Select First Walkthrough setting to Manage Walkthrough, selecting the first walkthrough in the list when none is selected,
- Added a changelog view to the settings menu: click the version number at the bottom to see the latest release's notes, with a link to the full changelog,
- Updated the settings menu to group Staff Walkthrough Improvements' options into expandable sections (Walkthrough Page, Edit Walkthrough and Manage Walkthrough),
- Updated Move Edit Page Button To The Left to Move Buttons To The Left, which now moves the Unlock button as well as the Edit Page button,
- Behind the scenes, moved injected HTML to Handlebars templates, split each feature into its own files, and minified HTML and CSS to reduce package size.

## 2.0.1
- Fixed Improved Image Selector not working when a walkthrough had a lot of images,
- Fixed the walkthrough editor's theme switch not finding the site's theme on some pages,
- Behind the scenes, fixed the test runner not reporting correctly.

## 2.0.0
- Behind the scenes, moved from Gulp and Browserify to Webpack, which changes how the script is built but not how it works,
- Removed the logging in the browser console added in 1.4.0.

## 1.5.1
- Fixed cached pages expiring within seconds instead of after 7 days >_<.

## 1.5.0
- Added a theme switch button to the TinyMCE toolbar on Edit Walkthrough, so the editor's dark or light theme can be changed on its own instead of following the whole site, and your choice is remembered,
- Fixed duplicate achievements on Manage Walkthrough: they are now combined into one row with their page numbers joined together, and the total is updated to match,
- Fixed an error on Manage Walkthrough when a walkthrough had been selected but is no longer selected after "being improved" is ticked.

## 1.4.0
- Updated "Clickable Table Links" on Manage Walkthrough to also make achievements clickable,
- Added achievements from the walkthrough's games that are missing from the walkthrough's achievements table, and the table's total now shows "x/y" (listed out of all the games' achievements),
- Fixed the TinyMCE dark theme not applying correctly when the site theme was undefined,
- Fixed the "back to management" button wrongly re-applying the default status,
- Updated cached pages so expired ones are cleared each time the script starts,
- Added logging to the browser console,
- Behind the scenes, the regex helpers and the staff walkthrough scripts (now one script per page) were refactored.

## 1.3.0
- Added a "Clickable Table Links" setting, which turns the games and gamers listed on Manage Walkthrough into links,
- Fixed the sticky page history still running when its setting was turned off,
- Fixed the improved image selector breaking when a game has no images,
- Behind the scenes, pages fetched for the new links are cached for 24 hours.

## 1.2.0
- Added a dark mode theme to the TinyMCE editor on Edit Walkthrough, which follows the site theme,
- Added an "Improved Image Selector" setting, which keeps the image selector's header (game name and add images link) in view, shows each image's title, and closes the selector when you click elsewhere.

## 1.1.0
- Added a "Default Status for Manage Walkthrough" setting, which picks the status filter the Manage Walkthrough page opens on.

## 1.0.2
- Fixed the "being improved" checkbox breaking the Manage Walkthrough page layout.

## 1.0.1
- Fixed the sticky page history sticking too early.

## 1.0.0
- Initial release.