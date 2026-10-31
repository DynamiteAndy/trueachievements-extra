import { isFreshArrival, waitForElementWhileParsing } from '@ta-x-page';
import { pageParam } from '@ta-x-site';
import { settings } from '@ta-x-storage';

const { forum } = settings.game;

// Opens a game forum on the user's default tab when it's arrived at without one (a bookmark, a link we didn't point at
// it). Only on arriving: picking another tab loads the forum again from itself, and that pick sticks.
// Opening a tab loads the forum again, so it goes as soon as the tab is parsed. Resolves whether it opened one, so the
// page's other tasks can leave it to the page that comes
export const changeToDefaultThread = async (): Promise<boolean> => {
  if (!forum.defaultThread.peek() || !isFreshArrival()) {
    return false;
  }

  if (pageParam('type') !== null) {
    return false;
  }

  const type = forum.defaultThreadValue.peek();
  const anchor = await waitForElementWhileParsing<HTMLAnchorElement>(`.link-tabs a[href$=${type}]`);
  if (!anchor || anchor.classList.contains('selected')) {
    return false;
  }

  anchor.click();
  return true;
};
