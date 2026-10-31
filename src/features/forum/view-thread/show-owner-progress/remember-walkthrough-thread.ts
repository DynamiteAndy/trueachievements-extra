import { whenParsed } from '@ta-x-page';
import { GamesRegex, pageParam } from '@ta-x-site';
import { settings, whileSetting } from '@ta-x-storage';

import { rememberOwnerProgressUrl } from './owner-progress-urls';

const { showOwnerProgress: setting } = settings.forum.viewThread;

// Where a walkthrough's pages link its discussion thread: the hub's summary ("Walkthrough forum"), each page's
// disclaimer ("Walkthrough Thread"), and the side column's "Discuss this walkthrough in its Walkthrough Thread"
const threadLink = ['.summary', '.disclaimer', '.thread']
  .map((container) => `${container} a[href*="viewthread.aspx?tid="]`)
  .join(', ');

// The walkthrough's hub, whichever of its pages is open: the thread's section reads the gamers involved and the thanks
// from it, as it does for a link found in the thread
export const walkthroughHub = (href: string = window.location.href): string =>
  new URL(`/game/${GamesRegex.Extract.gameName(href)}/walkthrough`, href).href;

// On a walkthrough's page, remembers it for its thread, so the thread shows the owner's progress without looking
// through its posts for the link. Applied live: turned on with the page open, it remembers then. Returns the stop
export default (): (() => void) =>
  whileSetting(
    [setting],
    () => setting.value,
    async (aborted) => {
      await whenParsed();

      const link = document.querySelector<HTMLAnchorElement>(threadLink);
      const threadId = link ? pageParam('tid', link.href) : null;

      if (threadId && !aborted.aborted) {
        await rememberOwnerProgressUrl(threadId, walkthroughHub());
      }
    }
  );
