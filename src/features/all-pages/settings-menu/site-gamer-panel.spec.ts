import { find, setHtml } from '@ta-x-test';

import { siteGamerPanelSelector, waitForSiteGamerPanel } from './site-gamer-panel';
import styles from './styles';

describe('all-pages/settings-menu/site-gamer-panel', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/home-page/header-signed-in.html');
  });

  test('should find the site gamer panel, not our settings menu, which borrows its classes', async () => {
    // Our menu, as the settings menu mounts it: the site's panel classes plus our own, ahead of the site's on the page
    const site = find('.nav-gamer');
    const ours = site.cloneNode() as HTMLElement;
    ours.classList.add(styles.jsFeature);
    site.before(ours);

    expect(document.querySelector(siteGamerPanelSelector)).toBe(site);
    expect(await waitForSiteGamerPanel()).toBe(site);
  });

  test('should give up at once for a signal already aborted', async () => {
    find('.nav-gamer').remove();
    const aborted = new AbortController();
    aborted.abort();

    // Without giving up, this waits out waitForElement's timeout and the test times out
    expect(await waitForSiteGamerPanel(aborted.signal)).toBeNull();
  });
});
