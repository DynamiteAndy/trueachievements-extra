# Feature Documentation

Most settings apply straight away: turn one on and it takes effect, turn it off and the page goes back to how it was. The few that need a reload say so when you close the menu. Default filters apply the next time you open the page, as a reload keeps the filter you're on.

An **Override** setting gives its page its own copy of the settings it lists, shown under it; while it's off, the page follows the shared ones. Each copy keeps what you chose.

# General

### Sticky Header

Keeps the header at the top of the page, hiding it as you scroll down and showing it again as you scroll up. **Remain Stuck** keeps it showing all the time. While one of the header's menus (Gaming, Community, My Links) is open, the header stays where it is. **Fit Menus To Window** adds columns to those menus when they're too tall for the window: just enough to show the whole menu, up to three, each heading kept with its links. Each column is only as wide as its links need, with short links sharing a line, and the menu scrolls when even three columns are too tall. A menu that fits stays as the site has it.

### More Emojis

Adds unicode emojis to the site's own, in forum replies and quick replies, direct messages, news quick replies, a solution's add-comment page and an achievement's comment box.

### Auto Opt In To Giveaways

Enters you into the site's daily Xbox game giveaway, at most once an hour while you browse (once across several tabs), and tells you when you've been entered. You need to be signed in.

# Forums

### Hide Threads By Keyword

Hides threads whose titles match your keywords, on message boards, My Threads and game forums.

## My Threads

### Override Forum Settings

Gives My Threads its own Hide Threads By Keyword.

## Walkthrough Threads

### Show Walkthrough Information

Shows a walkthrough thread's walkthrough in the side column: the gamers involved and its thanks once published. If the walkthrough can't be found, or isn't published yet, it asks for its link (its full address or one starting `/game/…`).

A "Linked walkthrough" line shows which walkthrough it's linked to, with a pencil to change it. Visiting a walkthrough's own page also links its thread.

# Gamer

### Add Group By Game Button

Adds a button to "My unlocked achievements" that groups the page's achievements by game, alphabetically; turning the setting off puts the site's order back. It's unstyled for now, so if you have ideas for how it should look - let me know!

# Games

### Add Not In Collection Button

Adds a button to the "Full Xbox Games List" that highlights the games on the page that aren't in your collection; turning the setting off takes it away. It's unstyled for now, so if you have ideas for how it should look - let me know!

## Achievements

### Show Progress As XX/XX

Shows the progress for a game and each DLC as xx/xx rather than only the totals. Games without DLC aren't covered yet - should they be? Let me know!

### Collapsible Groups

Adds a collapse button to the game's and each DLC's header, so a long list can be folded away group by group.

### Default Status

Picks your chosen status filter when you arrive at a game's achievements page.

### Leaderboard Links (no setting)

On a game's achievements, challenges and DLC pages, each progress bar links to its leaderboard.

## Challenges

### Override Achievement Settings

Gives challenges their own Show Progress As XX/XX.

### Default Status

Picks your chosen status filter when you arrive at a game's challenges page.

## Forums

### Override Forum Settings

Gives game forums their own Hide Threads By Keyword.

### Default Thread Type

Picks your chosen thread type when you open a game's forum without one; a link to a particular tab keeps it.

## Clips

### Default Filters

Picks your chosen filters when you arrive at a game's clips page.

## Walkthrough

### Highlight Progress On Hover

Hover over a paragraph in a game's walkthrough to highlight your progress in it.

## DLC

### Override Achievement Settings

Gives DLC their own Show Progress As XX/XX, Collapsible Groups and Default Status.

## Extra Guides

### Show XboxAchievements.com / PlaystationTrophies.org / GamertagNation.com Guides

Adds guides from [XboxAchievements.com](https://www.xboxachievements.com/), [PlaystationTrophies.org](https://www.playstationtrophies.org/) and [GamertagNation.com](https://www.gamertagnation.com/) to an achievement's solutions. Each site has its own setting and its own tab in the side column of a game's achievements, DLC and achievement pages.

1. In the site's tab, paste the game's guide page from that site (e.g. `https://www.xboxachievements.com/game/mass-effect/guide/`) and click **Save**.
2. The guide page opens in a background tab, its guides are read, and the tab closes itself ("Importing…" shows meanwhile).
3. Each of the game's achievement pages then shows the site's guide at the top of its solutions, matched by the achievement's name.

In the tab, **+** adds another page (PlaystationTrophies only, for a game split in two there), the pencil changes the page, **×** removes it with its guides, and **Import** shows for a page whose guides haven't been read yet.

- Visiting a guide page yourself also reads its guides again.
- If the background tab doesn't close, switch to it: the site may want you to confirm you're not a bot.
- Gamertag Nation links in the old `games.php` form won't import: use its `/game/<name>/guides` page.

# News

## Sales

### Default Sort

Sorts the sales page the way you choose.

### Hide Owned Items

Hides what you already own. Your games are checked at least once a day.

### Hide Unobtainable Items

Hides items with unobtainable achievements.

### Highlight Wishlist Items

Tags the games and DLC on your wishlist with "Wishlist" in sale tables. What's on sale from your wishlist is checked at least once an hour.

### Include Bundles With Wishlist Items

Also tags the editions, bundles and passes that include something on your wishlist, with "Contains wishlist".

### Collapsible Groups

Lets sale tables be collapsed and expanded.

### Ad Rows (TA Pro, no setting)

Hides the empty rows TA Pro leaves where adverts were, which otherwise gather at the top of a sorted table.

# Staff

## Edit Walkthrough

### Improved Image Selector

Gives the image selector a cleaner look, with the add image link fixed at the top.

### Show Autosave Notifications

Shows a notification when the walkthrough autosaves.

### Editor Tweaks (no setting)

- The editor's toolbar stays under the header as you scroll.
- A light and dark theme toggle for the editor, following the site's theme until you pick one.
- An icon for the toolbar's Select all button, which the site's editor leaves blank.
- Text color and Background color pick from the site's colours, or any colour from the picker.
- A Controller Buttons menu, an Insert Xbox captures button and a Source Code button.
- A colour picker for Table properties' Border and Background colours.

## Manage Walkthrough

### Clickable Table Links

Makes the achievements, games and gamers in its tables link to their pages.

### Add Missing Buttons

Stops buttons like add page and edit page going missing while you add or edit pages.

### Auto Select First Walkthrough

Selects the first walkthrough in the list when none is selected.

### Default Status

Picks your chosen walkthrough status when none is selected or no walkthrough is open.

### Page Layout (no setting)

- An achievement listed on several pages shows as one row, with all its pages and the total corrected.
- The side panels sit in a column of their own, and the Action menu's items show as buttons.
- A black page background, as on the walkthrough page and preview.

## Walkthrough Page

### Stick Page History To The Left

Keeps the left sidebar in view, with its editing buttons and links.

### Move Buttons To The Left

Moves the page's right-hand buttons into the left sidebar, handy with Stick Page History To The Left.

### Add Walkthrough Team Button

Adds a button to the left sidebar for the manage walkthrough page (editors don't get one otherwise).

### Highlight Page Locked Message

Makes the page locked message stand out.

### Page Layout (no setting)

- The page history and the preview sit side by side.
- A black page background.

## Walkthrough Preview

### Fill In Side Column

Fills in the preview's side column, so it looks as the walkthrough will. Works for walkthroughs "In progress", "Ready for review", "Ready for publish" or "Published".

If it doesn't know a page preview's walkthrough yet, it asks for the walkthrough id once. Its details are kept for 4 hours, so a published walkthrough's thanks count can be up to 4 hours old; saving or deleting something on the walkthrough's manage page (or reloading it, or its walkthrough page) refreshes them, while just looking keeps them.

### Page Layout (no setting)

- The previous and next page links are stacked.
- A black page background.
