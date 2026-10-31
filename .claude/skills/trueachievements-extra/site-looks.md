# Closest site matches for our UI

When a component needs a look (tabs, a group header, a section), copy the closest thing the site already has rather than inventing one. Measure it live in **both themes** (`getComputedStyle`; switch the theme yourself, live-site.md → "Switching the site theme"), never eyeball it. Each entry below was measured live. Add to this list whenever you find a new match.

| Need | Closest site element | Light | Dark | Used by |
|---|---|---|---|---|
| Tabs on a dark bar | Gamer menu tabs (`div.nav-gamer .labels label`, `.active` selected) | bar #161616; tabs #9c9c9c; selected filled #107c10, white text; no hover change | same | Settings menu tab bar |
| Group header inside a panel | Subheading in the gamer menu's Settings tab (`#divTab_Settings div.title`, "My current services and subscriptions") | no background; 13px, weight 500, 19.5px line; `10px 0` padding; 1px #e6e6e6 line under; text #495057 | line #616161; text #ddd | Settings menu accordion headers |
| Tabbed side section (gone from the site, see below) | Popular Content (`section.popular-content.tabbed.ns`, game pages) | section #fff; bar #e1e1e1; tabs share the width, 34px high, 14px 600, 3px top line; others #666 with white text and a clear line; selected #fff, text #646464, line #3f67a4 | section #333; bar #222; others #161616; selected #333, white text | `TabbedSection` / Extra Guides, with our per-position colours on the selected line |
| Side section with a title | Any `aside > section.<colour>` (e.g. First Winners): title `div`, body `article` | title 14px bold #646464, `0 0 0 8px` padding, 3px left line in the section's colour; section `8px 10px` padding, 12px text | text #ddd; section #333 | `Section` |
| Small coloured label in a side section | `span.subheader.green` (home page: "Coming soon", "Leaving soon") | #eeffd1 background; 12px 500, uppercase, centred; `4px` padding | not measured | Nothing yet (a candidate considered for the settings accordions) |
| List rows in a side section | Side lists (First Winners) | `5px 0` padding, 18px line, 1px #eee line under each row | line #222 | `GuideLinks` rows (see `site-quirks.md`) |
| A YouTube video | The site's lazyYT player (walkthrough pages; `<div class="lazyYT" data-youtube-id>`, filled by an inline jQuery plugin): a black 16:9 box, the video's thumbnail through `https://ip.trueachievements.com/remote/` (`img.youtube.com/vi/<id>/hqdefault.jpg`, `?width=640`), YouTube's play button (#1f1f1f, #cc181e on hover), and `youtube.com/embed/<id>?rel=0&autoplay=1` once clicked (its iframe has only `src`, `frameborder` and `allowfullscreen`, no `title`: ours adds `title="YouTube video player"` for screen readers, the maintainer's call) | as measured | same | `YouTubeVideo` (imported guides). Achievement pages don't load the plugin or its 7 rules, so they're in `youtube-video.scss`; only `.body .lazyYT-container { margin-top: 1rem }` is there |
| Small kind label beside a name | The wishlist's listing pills (`/gamer/<name>/wishlist?sale=1`, `.wl-item .wl-pill.game` / `.bundle` / `.addon`, and `.wl-badge` "DLC"): their CSS is the wishlist page's own, so copy the values | 11px 600, 17.6px line, `0 6px` padding, 3px radius; game #e0eef9 on #1d6eb7 text; bundle #efe3ff, text #5b2a9e; addon `--ta-green-tint` with `--ta-green-fill` text | game #1a3a54, text #b8d6ee; bundle #3a2a57, text #d2b8f5 | `WishlistPill` (sales' Highlight Wishlist Items: game colours for "Wishlist", bundle colours for "Contains wishlist") |
| Row tint | The site-wide `--ta-green-tint` (on `div.page`) with `--ta-green-fill` | tint `rgba(63, 145, 66, .12)`, fill #15803d | tint `rgba(74, 222, 128, .14)`, fill #15803d | Nothing yet. The games list's `tr.green` does nothing in a sale table (its striping wins) |
| Heading inside a gamer menu tab | Gamer tab's `li.title` ("Recent games", "Next achievements") | 15px 400, `5px 0` padding, flex row with its buttons | not measured | Nothing yet |

## Not a match, and why

- **Hot Threads tabs** (`div.paneltabs > a.selected`): their CSS is scoped to `section.hotthreadlist` and only loaded on forum pages.
- **Popular Content lost its tabs:** it's now `section.popular-content.ns.w-full` holding one `div.tab-content` list (padding: section `0 0 10px`, list `10px 10px 5px`), on the home page and news articles, not game pages. The tabbed look above is from before; there's no tabbed side section on the site to measure against now.
- **Popular Content's own classes** (`.tabbed`, `.popular-content`): the site's script binds to `.tabbed`, and the CSS restyles every `li`, `section` and `.row` inside. Copy its look into our own class instead (`TabbedSection`).
- **Our tab bars' selected-tab colours are intended** (the maintainer's ruling): `ui/tabs/_tabs.scss` gives each position its own colour (green, blue, red…, the guide sites' first), on every tab bar, the emoji picker included. Only the settings menu turns them off (`border: 0 !important`). Don't treat them as a leftover.
- **The `labels` class** for anything other than the gamer menu's tab bar: it's #161616 on both themes, so a header carrying it stays a dark bar inside the light theme's white panel (the old settings accordion headers).
- **The site's `ns` class** turns the side-section look off (site-quirks.md → "Side section children").

## Measuring tips

- The site's own gamer menu is `div.nav-gamer` without `ta-x-settings-menu` (ours carries both classes). Find it in the DOM, or ask the user to open it; clicking its tab icons only switches tabs, and its Settings tab is safe to look at (don't click its toggles or links).
- `:hover` styles need a real hover (`computer` `hover`), then `el.matches(':hover')` to confirm. `computer` coordinates are in the screenshot frame, not CSS pixels (the scale depends on the screen: local.md → Machine; work it out from `innerWidth` against the screenshot's width).
- Read tag/class trees and text, not `outerHTML` (privacy filter: live-site.md → "Chrome's privacy filter").
