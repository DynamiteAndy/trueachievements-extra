import { fetchOk, memoizeFetchExtract } from '@ta-x-fetch';
import { durationMs, logger } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { MiscellaneousRegex, parsePostback, postbackBody, signedInGamerId, siteUrl } from '@ta-x-site';
import { settings, stored, whileSetting } from '@ta-x-storage';
import { showToast } from '@ta-x-ui';

import { settingsMenuOpen } from '../settings-menu';

const { giveawayAutoOptIn: setting } = settings.allPages;

// The giveaway page's entry is kept only a short while. Once entered it has no countdown, so it can't be kept until the
// giveaway ends; a short keep means a new day's giveaway is entered soon after it starts
const keepGiveawayPage = { deleteAfter: { value: 1, period: 'hours' } } as const;

// The giveaway last posted, by its postback argument: once the site has answered, that giveaway isn't posted again,
// even when the site never marks it entered
const triedGiveaway = stored('giveawayAutoOptInTried', '');

// The giveaway a tab is posting, by its postback argument, and when it started: tabs loading together would each post
// it before any answer arrives, so the first to claim it posts and the others leave it. Storage has no compare-and-set,
// so this narrows that race rather than closing it. A claim lapses after a while, for a tab closed before its answer
const claimedGiveaway = stored<{ argument: string; at: number } | null>('giveawayAutoOptInClaimed', null);
const claimLasts = durationMs({ value: 1, period: 'minutes' });

// What was tried and claimed belongs to the gamer signed in then: another gamer signed in on the same browser gets the
// giveaway entered for them too (maintenance.ts, when the signed-in gamer changes)
export const forgetGiveawayTries = (): void => {
  triedGiveaway.delete();
  claimedGiveaway.delete();
};

// What entering posts: the giveaway's postback argument, and the form's fields (as a query string, kept as JSON)
type GiveawayEntry = { argument: string; body: string };

// Today's giveaway's entry: the page's first giveaway, unless that's the previous one's winner (no giveaway running) or
// it's entered (which stops a second entry when the block still has its enter link)
const readEntry = (page: Document): GiveawayEntry | null => {
  const giveaway = page.querySelector<HTMLElement>('.competition .game');
  if (!giveaway || giveaway.classList.contains('winner') || giveaway.classList.contains('entered')) {
    return null;
  }

  const enterLink = giveaway.querySelector('.entry a');
  if (!enterLink) {
    return null;
  }

  const form = giveaway.closest('form');
  if (!form) {
    return null;
  }

  const postback = parsePostback(enterLink.outerHTML);
  if (!postback?.argument) {
    return null;
  }

  return { argument: postback.argument, body: postbackBody(form, postback).toString() };
};

// Only the entry is kept, not the giveaway page, so a page loaded later skips parsing it; a visit to the page reads it
// afresh. Its fetch is fetchOk's, looked up at each call
const giveawayUrl = `${siteUrl}/win-xbox-games`;
const fetchEntry = memoizeFetchExtract((url, options) => fetchOk(url, options), readEntry, '#entry');

// On the giveaway page itself the script starts while the page is still parsing, so it waits for the giveaway and the
// form's fields
const getCurrentEntry = async (): Promise<GiveawayEntry | null> =>
  MiscellaneousRegex.Test.winXboxGamesUrl()
    ? whenParsed().then(() => readEntry(document))
    : fetchEntry(giveawayUrl, {}, keepGiveawayPage);

// The giveaway's game, when the site's response names it
type GiveawayGame = { href: string; title: string };

// The toast after entering a giveaway, linking its game when the response names it
const showEntered = (game: GiveawayGame | null): void => {
  showToast({
    text: game ? (
      <>
        Entered giveaway for <a href={game.href}>{game.title}</a>.
      </>
    ) : (
      'Giveaway entered.'
    ),
    type: 'success',
    timeoutMs: 5000
  });
};

const enterGiveaway = async ({ argument, body: requestBody }: GiveawayEntry): Promise<void> => {
  try {
    const response = await fetchOk('/win-xbox-games', {
      method: 'POST',
      body: new URLSearchParams(requestBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    // Only once the site has answered: a post that never arrived is tried again on the next page load
    triedGiveaway.set(argument);

    const body = await response.text();
    const bodyDocument = new DOMParser().parseFromString(body, 'text/html');

    // Entered only when the answer says so: the giveaway's block marked `entered` ("You have entered"), so an error
    // page isn't shown as entered and kept as the giveaway page (whose entry, once entered, is none)
    if (bodyDocument.querySelector('.competition .game')?.classList.contains('entered')) {
      const gameTitle = bodyDocument.querySelector('.competition a');

      showEntered(gameTitle && { href: gameTitle.getAttribute('href') ?? '', title: gameTitle.textContent.trim() });

      await fetchEntry.update(giveawayUrl, bodyDocument, keepGiveawayPage);
    }
  } catch (error) {
    // An error answer is still the site's answer to this giveaway, so it isn't posted again; a post that never arrived
    // (the network failed) is tried again on the next page load
    if (error instanceof Response) {
      triedGiveaway.set(argument);
    } else {
      claimedGiveaway.delete();
    }
    logger.warn('giveaway-auto-opt-in', "the giveaway entry wasn't posted", error);
  }
};

const enterCurrentGiveaway = async (): Promise<void> => {
  const entry = await getCurrentEntry();
  if (!entry || entry.argument === triedGiveaway.get()) {
    return;
  }

  const claim = claimedGiveaway.get();
  if (claim?.argument === entry.argument && Date.now() - claim.at < claimLasts) {
    return;
  }
  claimedGiveaway.set({ argument: entry.argument, at: Date.now() });

  await enterGiveaway(entry);
};

const optIn = async (): Promise<void> => {
  // Signed out, the site turns the entry down ("Please register or log in to enter this competition") and keeps
  // offering it, so every page would send it again
  if (!signedInGamerId()) {
    return;
  }

  await enterCurrentGiveaway();
};

// Enters today's giveaway when the page loads with the setting on, and when it's turned on in the menu (applied live).
// Off has nothing to undo: an entry is on the site. A change reaches every open tab, and each would post an entry, so a
// change applies only in the tab whose settings menu is open (the one it was made in); the others enter on their next
// page load. One try a page: turned on again (or twice while the first post is under way), it waits on the same try
// rather than posting again, as the page's own markup still shows the giveaway not entered. Returns the stop
export default (): (() => void) => {
  let pageLoad = true;
  let tried: Promise<void> | null = null;
  const stop = whileSetting(
    [setting],
    () => setting.value,
    async () => {
      if (pageLoad || settingsMenuOpen.peek()) {
        tried ??= optIn();
        await tried;
      }
    }
  );
  // The effect has run once, for the page load: from here on it's a change
  pageLoad = false;

  return stop;
};
