import { settings } from '@ta-x-storage';
import { changeSettingLive, setHtml, setSettings, stillParsing, tick } from '@ta-x-test';

import { getOwnerProgressUrl, ownerProgressUrls } from './owner-progress-urls';
import rememberWalkthroughThread, { walkthroughHub } from './remember-walkthrough-thread';

describe('forum/view-thread/show-owner-progress/remember-walkthrough-thread', () => {
  const run = async (): Promise<void> => {
    onTestFinished(rememberWalkthroughThread());
    await tick();
  };

  test.each([
    ['https://www.trueachievements.com/game/Digimon-Survive/walkthrough', 'Digimon-Survive'],
    ['https://www.trueachievements.com/game/Digimon-Survive/walkthrough/2', 'Digimon-Survive'],
    ['https://www.trueachievements.com/game/Gears-of-War-4/walkthrough/1', 'Gears-of-War-4']
  ])("should take %s to its walkthrough's hub", (url, game) => {
    expect(walkthroughHub(url)).toBe(`https://www.trueachievements.com/game/${game}/walkthrough`);
  });

  // A page whose disclaimers have no thread link
  test('should remember nothing on a page without a thread link', async () => {
    setHtml('@ta-x-test-views/game-walkthrough/gears-of-war-4-page-1.html', {
      url: 'https://www.trueachievements.com/game/Gears-of-War-4/walkthrough/1'
    });
    setSettings({ 'forum.viewThread.showOwnerProgress': true });
    const setSpy = vi.spyOn(ownerProgressUrls, 'set');

    await run();
    await changeSettingLive(settings.forum.viewThread.showOwnerProgress, false);
    await changeSettingLive(settings.forum.viewThread.showOwnerProgress, true);

    expect(setSpy).not.toHaveBeenCalled();
  });

  const hub = 'https://www.trueachievements.com/game/Digimon-Survive/walkthrough';

  test.each([
    ['its summary links, on the hub', 'digimon-survive-hub-thread-link', hub],
    ["a page's disclaimer links, on any other page", 'digimon-survive-page-2-thread-links', `${hub}/2`]
  ])('should remember the hub for the thread %s', async (_, fixture, url) => {
    setHtml(`@ta-x-test-views/game-walkthrough/${fixture}.html`, { url });
    setSettings({ 'forum.viewThread.showOwnerProgress': true });

    await run();

    expect(await getOwnerProgressUrl('1416296')).toBe(hub);
  });

  test('should remember nothing when show owner progress is turned off while the page is still parsing', async () => {
    setHtml('@ta-x-test-views/game-walkthrough/digimon-survive-hub-thread-link.html', { url: hub });
    setSettings({ 'forum.viewThread.showOwnerProgress': true });
    const finishParsing = stillParsing();

    await run();
    await changeSettingLive(settings.forum.viewThread.showOwnerProgress, false);
    finishParsing();
    await tick();

    expect(await getOwnerProgressUrl('1416296')).toBeNull();
  });

  test('should remember nothing while show owner progress is off, and remember it once turned on live', async () => {
    setHtml('@ta-x-test-views/game-walkthrough/digimon-survive-hub-thread-link.html', { url: hub });
    setSettings({ 'forum.viewThread.showOwnerProgress': false });

    await run();

    expect(await getOwnerProgressUrl('1416296')).toBeNull();

    await changeSettingLive(settings.forum.viewThread.showOwnerProgress, true);

    expect(await getOwnerProgressUrl('1416296')).toBe(hub);
  });
});
