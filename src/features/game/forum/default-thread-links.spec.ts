import { find, setHtml, setSettings, tick } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { linkForumsToDefaultThread } from './default-thread-links';

describe('game/forum/default-thread-links', () => {
  const hrefs = (): string[] =>
    [...document.querySelectorAll<HTMLAnchorElement>('a[href*="/forum"]')].map(
      (anchor) => anchor.getAttribute('href') ?? ''
    );

  // The game hub's Forum tab, then the forum's own All / Community / Game Info tabs
  const asServed = [
    '/game/Gears-of-War-4/forum',
    '/game/Gears-of-War-4/forum?type=all',
    '/game/Gears-of-War-4/forum?type=community',
    '/game/Gears-of-War-4/forum?type=gameinfo'
  ];

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-hub/forum-tabs.html');
  });

  test('should leave the links alone while the default thread is off', async () => {
    setSettings({ 'game.forum.defaultThreadValue': 'community' });

    await linkForumsToDefaultThread();

    expect(hrefs()).toEqual(asServed);
  });

  test('should leave the links alone when the default is All Threads, the forum opening on it anyway', async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'all'
    });

    await linkForumsToDefaultThread();

    expect(hrefs()).toEqual(asServed);
  });

  test('should point links to a game forum at the default tab, leaving links that name a tab', async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'community'
    });

    await linkForumsToDefaultThread();

    expect(hrefs()).toEqual(['/game/Gears-of-War-4/forum?type=community', ...asServed.slice(1)]);
    // The game hub's other tabs are untouched
    expect(find('.tabs a[title="Gears of War 4 Videos"]').getAttribute('href')).toBe('/game/Gears-of-War-4/videos');
  });

  test("should leave a link to another site's forum alone, though its path looks like a game forum's", async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'community'
    });
    // The game hub's Forum tab, made into a link to another site
    const tab = find('.tabs li.tab_pink').cloneNode(true) as HTMLElement;
    find('a', tab).setAttribute('href', 'https://www.xboxachievements.com/game/Gears-of-War-4/forum');
    find('.tabs ul').append(tab);

    await linkForumsToDefaultThread();

    expect(find('a', tab).getAttribute('href')).toBe('https://www.xboxachievements.com/game/Gears-of-War-4/forum');
  });

  test('should point links added later at the default tab too', async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'gameinfo'
    });
    await linkForumsToDefaultThread();

    // The game hub's Forum tab, added again (as the site's scripts can)
    const tab = find('.tabs li.tab_pink').cloneNode(true) as HTMLElement;
    find('a', tab).setAttribute('href', '/game/Gears-of-War-4/forum');
    await act(async () => {
      find('.tabs ul').append(tab);
      await tick();
    });

    expect(find('a', tab).getAttribute('href')).toBe('/game/Gears-of-War-4/forum?type=gameinfo');
  });

  test('should go on to the other links past one whose address the browser cannot parse', async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'community'
    });
    // The game hub's Forum tab, with an address no URL can be made from, put before the others
    const tab = find('.tabs li.tab_pink').cloneNode(true) as HTMLElement;
    find('a', tab).setAttribute('href', 'http://[/forum');
    find('.tabs ul').prepend(tab);

    await linkForumsToDefaultThread();

    expect(find('a', tab).getAttribute('href')).toBe('http://[/forum');
    expect(hrefs().slice(1)).toEqual(['/game/Gears-of-War-4/forum?type=community', ...asServed.slice(1)]);
  });

  test('should leave links added after it is stopped alone', async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'gameinfo'
    });
    const stop = await linkForumsToDefaultThread();
    stop?.();

    const tab = find('.tabs li.tab_pink').cloneNode(true) as HTMLElement;
    find('a', tab).setAttribute('href', '/game/Gears-of-War-4/forum');
    await act(async () => {
      find('.tabs ul').append(tab);
      await tick();
    });

    expect(find('a', tab).getAttribute('href')).toBe('/game/Gears-of-War-4/forum');
  });
});
