import { settings } from '@ta-x-storage';
import {
  changeSetting,
  click,
  find,
  neverFinds,
  required,
  setHtml,
  setSettings,
  stubPageFetch,
  tick,
  useFakeTimers,
  visibleTabs
} from '@ta-x-test';
import { act } from 'preact/test-utils';

import { settingsAppliedOnArrival } from '../../game';
import { settingsTabs } from '../../settings-tabs';

import { showEveryTab } from './settings-menu.spec-helpers';
import { siteGamerPanelSelector } from './site-gamer-panel';
import styles from './styles';

import settingsMenu from '.';

describe('settings-menu', () => {
  const getMenu = () => document.querySelector<HTMLElement>(`.${styles.menu}`);
  const getWrench = () => document.querySelector<HTMLElement>(`.${styles.wrench}`);
  const isOpen = () =>
    required(getMenu()).classList.contains('open') && !required(getMenu()).classList.contains('ta-x-hide');

  // Signed in is the site's GamerID cookie
  const signIn = (signedIn: boolean): void => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(signedIn ? 'GamerID=52877' : '');
  };

  beforeEach(() => {
    signIn(true);
    setHtml('@ta-x-test-views/home-page/header-signed-in.html');
  });

  test('should add the settings menu after the site gamer panel, and the wrench after the gamer toggle', async () => {
    await act(async () => {
      await settingsMenu(settingsTabs, settingsAppliedOnArrival);
    });

    expect(document.querySelectorAll(`.${styles.menu}`)).toHaveLength(1);
    expect(find('.nav-gamer').nextElementSibling).toBe(getMenu());
    expect(find('[data-tgl="nav-gamer"]').nextElementSibling).toBe(getWrench());
  });

  test("should add the wrench before the login box signed out, and the menu at the end of the page, as there's no gamer panel", async () => {
    signIn(false);
    setHtml('@ta-x-test-views/home-page/header-signed-out.html');

    await act(async () => {
      await settingsMenu(settingsTabs, settingsAppliedOnArrival);
    });

    expect(document.querySelectorAll(`.${styles.menu}`)).toHaveLength(1);
    expect(find('.login-full').previousElementSibling).toBe(getWrench());
    expect(find('.page').lastElementChild).toBe(getMenu());

    click(required(getWrench()));
    expect(isOpen()).toBe(true);
  });

  test('should wait for the gamer toggle signed in, though the page comes with the login box until the site swaps it in', async () => {
    const signedIn = find('header nav').cloneNode(true) as HTMLElement;
    const gamerPanel = find('.nav-gamer').cloneNode(true);
    setHtml('@ta-x-test-views/home-page/header-signed-out.html');

    await act(async () => {
      const adding = settingsMenu(settingsTabs, settingsAppliedOnArrival);
      await tick();
      // The site's script: the login box out, the signed-in header's toggle and gamer page link in, the panel added
      find('.login-full').replaceWith(...signedIn.querySelectorAll(':scope > .gamer, :scope > .gamer-page'));
      find('.page').append(gamerPanel);
      await adding;
    });

    expect(find('[data-tgl="nav-gamer"]').nextElementSibling).toBe(getWrench());
    expect(find('.nav-gamer').nextElementSibling).toBe(getMenu());
  });

  test('should show the saved settings and save a change, showing and hiding the settings that depend on it', async () => {
    setSettings({ 'allPages.stickyHeader.enabled': false });
    await act(async () => {
      await settingsMenu(settingsTabs, settingsAppliedOnArrival);
    });
    showEveryTab(required(getMenu()));
    const remainStuck = () => required(getMenu()).querySelector('#ta-x-all-pages-sticky-header-remain-stuck');
    expect(remainStuck()).toBeNull();

    changeSetting(find<HTMLInputElement>('#ta-x-all-pages-sticky-header-enabled', getMenu()), true);

    expect(settings.allPages.stickyHeader.enabled.value).toBe(true);
    expect(remainStuck()).not.toBeNull();

    changeSetting(find<HTMLInputElement>('#ta-x-all-pages-sticky-header-enabled', getMenu()), false);
    expect(remainStuck()).toBeNull();
  });

  test('should show a change made in another tab straight away', async () => {
    await act(async () => {
      await settingsMenu(settingsTabs, settingsAppliedOnArrival);
    });
    showEveryTab(required(getMenu()));
    expect(find<HTMLInputElement>('#ta-x-all-pages-sticky-header-enabled', getMenu()).checked).toBe(false);

    // Another tab saving it: Tampermonkey tells this tab's settings
    await act(() => {
      GM_setValue('allPages.stickyHeader.enabled', true);
    });

    expect(find<HTMLInputElement>('#ta-x-all-pages-sticky-header-enabled', getMenu()).checked).toBe(true);
    // Its child row shows with it
    expect(find<HTMLInputElement>('#ta-x-all-pages-sticky-header-remain-stuck', getMenu()).type).toBe('checkbox');
  });

  // The footer's changelog and documentation links are SettingsMenu.spec's
  test('should switch feature tabs, keeping the one chosen selected', async () => {
    await act(async () => {
      await settingsMenu(settingsTabs, settingsAppliedOnArrival);
    });
    const link = (id: string) => find<HTMLElement>(`[aria-controls="ta-x-tabs-${id}"]`, getMenu());

    // Closed, it shows no panel
    expect(visibleTabs(getMenu())).toEqual([]);

    click(required(getWrench()));
    expect(visibleTabs(getMenu())).toEqual(['ta-x-tabs-general']);

    click(link('news'));
    expect(visibleTabs(getMenu())).toEqual(['ta-x-tabs-news']);

    expect(link('news').getAttribute('aria-selected')).toBe('true');

    click(link('forums'));
    expect(visibleTabs(getMenu())).toEqual(['ta-x-tabs-forums']);
  });

  // Each missing element is a timed-out wait (or, for the page, a lookup that finds nothing)
  describe.each([
    { name: 'the navigation bar', view: 'header-signed-in', missing: 'header nav' },
    { name: 'the gamer toggle', view: 'header-signed-in', missing: '[data-tgl="nav-gamer"]' },
    { name: 'the login box, signed out', view: 'header-signed-out', missing: '.login-full' },
    { name: 'the page, signed out', view: 'header-signed-out', missing: '.page' }
  ])('without $name', ({ view, missing }) => {
    beforeEach(() => {
      signIn(view === 'header-signed-in');
      setHtml(`@ta-x-test-views/home-page/${view}.html`);
      if (missing === '.page') {
        find('.page').classList.remove('page');
      }
      neverFinds(missing);
    });

    test('should add neither the wrench nor the menu, without throwing', async () => {
      await act(async () => {
        await expect(settingsMenu(settingsTabs, settingsAppliedOnArrival)).resolves.toBeUndefined();
      });

      expect(getWrench()).toBeNull();
      expect(getMenu()).toBeNull();
    });
  });

  test("should still add the wrench straight away, and the menu at the end of the page, when the gamer panel doesn't show", async () => {
    find('.nav-gamer').remove();
    neverFinds(siteGamerPanelSelector);

    await act(async () => {
      await expect(settingsMenu(settingsTabs, settingsAppliedOnArrival)).resolves.toBeUndefined();
    });

    expect(find('[data-tgl="nav-gamer"]').nextElementSibling).toBe(getWrench());
    expect(find('.page').lastElementChild).toBe(getMenu());
  });

  // The site loads its gamer panel with the gamerheader request, which can fail (refused)
  describe("while the site's gamer panel loads", () => {
    const gamerHeader = 'https://www.trueachievements.com/true-api/livehtml/gamerheader';
    // The site's panel, off the page until the site adds it
    let gamerPanel: HTMLElement;

    beforeEach(() => {
      gamerPanel = find('.nav-gamer');
      gamerPanel.remove();
      // The page's fetch, which the HTTP intercept wraps once the wait listens: refused for the gamer header, a
      // server error for others (the intercept hands it a Request)
      stubPageFetch(async (url) => {
        const address = url instanceof Request ? url.url : url.toString();
        return new Response('', { status: address.endsWith('/gamerheader') ? 403 : 500 });
      });
      useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    });

    test("should give up on it as soon as the site's request for it fails, and put the menu at the end of the page", async () => {
      await act(async () => {
        const adding = settingsMenu(settingsTabs, settingsAppliedOnArrival);
        await vi.advanceTimersByTimeAsync(0);
        await fetch(gamerHeader);
        await adding;
      });

      expect(find('[data-tgl="nav-gamer"]').nextElementSibling).toBe(getWrench());
      expect(find('.page').lastElementChild).toBe(getMenu());
    });

    test('should keep waiting for it when only another request fails, and put the menu after it once it shows', async () => {
      await act(async () => {
        const adding = settingsMenu(settingsTabs, settingsAppliedOnArrival);
        await vi.advanceTimersByTimeAsync(0);
        await fetch('https://www.trueachievements.com/true-api/livehtml/other');
        await vi.advanceTimersByTimeAsync(9000);
        expect(getMenu()).toBeNull();

        find('.page').append(gamerPanel, document.createElement('footer'));
        await vi.advanceTimersByTimeAsync(0);
        await adding;
      });

      expect(gamerPanel.nextElementSibling).toBe(getMenu());
    });
  });
});
