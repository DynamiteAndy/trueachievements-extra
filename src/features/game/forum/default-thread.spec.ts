import { arriveFrom, find, recordEvents, required, setHtml, setSettings, stillParsing, tick } from '@ta-x-test';

import { changeToDefaultThread } from './default-thread';

describe('game/forum/default-thread', () => {
  const forum = 'https://www.trueachievements.com/game/Gears-of-War-4/forum';
  let clicked: string[];

  // The forum on All Threads, arrived at from `referrer`. Each tab is a plain link to the forum with ?type=…; the
  // clicks are recorded and cancelled, as following one would load a page
  const arrive = (referrer: string, url = forum): void => {
    setHtml('@ta-x-test-views/game-hub/forum-tabs.html', {
      url
    });
    arriveFrom(referrer);
    clicked = recordEvents('click', (event) => (event.target as HTMLAnchorElement).getAttribute('href') ?? '', {
      cancel: true
    });
  };

  const defaultCommunity = (): void =>
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'community'
    });

  test('should leave the forum alone while the default thread is off', async () => {
    setSettings({ 'game.forum.defaultThreadValue': 'community' });
    arrive('https://www.trueachievements.com/game/Gears-of-War-4');

    await changeToDefaultThread();

    expect(clicked).toEqual([]);
  });

  test('should open the default tab on arriving from another page', async () => {
    defaultCommunity();
    arrive('https://www.trueachievements.com/game/Gears-of-War-4');

    await changeToDefaultThread();

    expect(clicked).toEqual(['/game/Gears-of-War-4/forum?type=community']);
  });

  test('should leave the tab the user picked, which loads the forum again from itself', async () => {
    // A tab is a plain GET of ?type=…, arriving with the forum's own pathname as its referrer
    defaultCommunity();
    arrive(`${forum}?type=community`, `${forum}?type=all`);

    await changeToDefaultThread();

    expect(clicked).toEqual([]);
  });

  test('should do nothing when the forum is already on the default tab', async () => {
    defaultCommunity();
    arrive('https://www.trueachievements.com/game/Gears-of-War-4', `${forum}?type=community`);

    await changeToDefaultThread();

    expect(clicked).toEqual([]);
  });

  test('should keep the tab a link from another page names', async () => {
    defaultCommunity();
    arrive('https://www.trueachievements.com/game/Gears-of-War-4', `${forum}?type=gameinfo`);

    expect(await changeToDefaultThread()).toBe(false);
    expect(clicked).toEqual([]);
  });

  // The forum's own address has no ?type=, and shows All Threads
  test('should do nothing when the default tab is the one the forum shows without a type', async () => {
    setSettings({
      'game.forum.defaultThread': true,
      'game.forum.defaultThreadValue': 'all'
    });
    arrive('https://www.trueachievements.com/game/Gears-of-War-4');

    expect(await changeToDefaultThread()).toBe(false);
    expect(clicked).toEqual([]);
  });

  describe('while the page is still being parsed', () => {
    test('should open the default tab as soon as it is parsed', async () => {
      defaultCommunity();
      arrive('https://www.trueachievements.com/game/Gears-of-War-4');
      stillParsing();
      const tabs = find('.link-tabs');
      const [parent, next] = [tabs.parentElement, tabs.nextSibling];
      tabs.remove();

      const opening = changeToDefaultThread();
      await tick();

      expect(clicked).toEqual([]);

      required(parent).insertBefore(tabs, next);

      expect(await opening).toBe(true);
      expect(clicked).toEqual(['/game/Gears-of-War-4/forum?type=community']);
    });

    test('should give up once the page is parsed without the tabs', async () => {
      defaultCommunity();
      arrive('https://www.trueachievements.com/game/Gears-of-War-4');
      const finishParsing = stillParsing();
      find('.link-tabs').remove();

      const opening = changeToDefaultThread();
      finishParsing();

      expect(await opening).toBe(false);
      expect(clicked).toEqual([]);
    });
  });
});
