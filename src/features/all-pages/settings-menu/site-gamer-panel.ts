import { httpIntercept } from '@ta-x-fetch';
import { waitForElement } from '@ta-x-page';

import styles from './styles';

// The site's gamer panel (our settings menu borrows its classes, so it's left out)
export const siteGamerPanelSelector = `.nav-gamer:not(.${styles.jsFeature})`;

// Waits for the site's gamer panel, null if it doesn't show. The site loads it with an ajax request (gamerheader) that
// can fail (e.g. a 403), and then it never appears, so the wait gives up as soon as that request's response says it
// failed rather than sitting out its full timeout. `signal` gives up too
export const waitForSiteGamerPanel = async (signal?: AbortSignal): Promise<HTMLElement | null> => {
  const giveUp = new AbortController();
  const abort = (): void => giveUp.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) {
    abort();
  }

  // There's only ever one gamerheader request, so `once: true` unregisters as soon as the listener stops returning
  // `false` (i.e. as soon as it's not some other request)
  const stopWatchingForGamerHeaderResponse = httpIntercept.onResponse(
    ({ req, res }) => {
      if (new URL(req.url).pathname !== '/true-api/livehtml/gamerheader') {
        return false;
      }
      if (!res.ok) {
        abort();
      }
    },
    { once: true }
  );

  try {
    return await waitForElement(siteGamerPanelSelector, { signal: giveUp.signal });
  } finally {
    // For a response that never arrives; unregistering twice is a harmless no-op
    stopWatchingForGamerHeaderResponse();
    signal?.removeEventListener('abort', abort);
  }
};
