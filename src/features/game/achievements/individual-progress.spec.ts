import * as taxFetch from '@ta-x-fetch';
import { memoizedFetches } from '@ta-x-fetch';
import * as taxLib from '@ta-x-lib';
import { isAppliedLive, settings } from '@ta-x-storage';
import {
  changeSettingLive,
  expectAppliesLive,
  find,
  readFixture,
  readFixtureDocument,
  required,
  setHtml,
  setSettings,
  tick
} from '@ta-x-test';

import { expectNotRun, progressHeaders, progressOf, start } from '../shared/individual-progress.spec-helpers';

import { collapsibleGroups } from './collapsible-groups';
import { individualProgress } from './individual-progress';

const { achievements } = settings.game;

describe('game/achievements/individual-progress', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/empty.html');
  });

  test('should leave the page as it is when the page fetched with every status has no list', async () => {
    setHtml('@ta-x-test-views/game-achievements/won-with-dlc-not-won-status.html', {
      url: 'https://www.trueachievements.com/game/Gears-of-War-4/achievements'
    });
    setSettings({ 'game.achievements.individualProgress': true });
    // The full list's page without its main
    const page = readFixtureDocument('@ta-x-test-views/game-achievements/won-with-dlc.html');
    required(page.querySelector('main')).remove();
    vi.spyOn(taxFetch, 'fetchOk').mockResolvedValueOnce(new Response(page.documentElement.outerHTML));
    const served = find('main').innerHTML;

    await start(individualProgress);

    expect(find('main').innerHTML).toBe(served);
  });

  test.each([{ view: '@ta-x-test-views/game-achievements/won-no-dlc.html' }])(
    'should not run if game has no dlc, its setting still applying live',
    async ({ view }) => {
      setHtml(view);
      setSettings({ 'game.achievements.individualProgress': true });

      await expectNotRun(individualProgress, view);
      expect(isAppliedLive(achievements.individualProgress)).toBe(true);
    }
  );

  // A copy cached earlier (here from before anything was won) would miss what's been won since: the full list is
  // fetched fresh and stored, for the pages that read it
  test('should fetch the page with every status shown, fresh, when the page shows the achievements not won', async () => {
    const url = 'https://www.trueachievements.com/game/Gears-of-War-4/achievements';
    const fresh = readFixture('@ta-x-test-views/game-achievements/won-with-dlc.html');
    await memoizedFetches.set(url, readFixture('@ta-x-test-views/game-achievements/none-won-with-dlc.html'));
    setHtml('@ta-x-test-views/game-achievements/won-with-dlc-not-won-status.html', { url });
    setSettings({ 'game.achievements.individualProgress': true });
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk').mockResolvedValueOnce(new Response(fresh));

    await start(individualProgress);

    expect(fetchSpy.mock.calls).toEqual([[url]]);
    expect(progressOf(progressHeaders().baseGame)).toEqual({
      trueAchievement: '1,283/1,590',
      gamerscore: '930/1,000',
      achievements: '38/39'
    });
    await vi.waitFor(async () => expect(await memoizedFetches.get(url)).toBe(fresh));
  });

  // Set to Won, the page lists every achievement won under its group's header, which is all the progress needs
  test('should read a page set to Won as it is, fetching nothing', async () => {
    setHtml('@ta-x-test-views/game-achievements/won-with-dlc-won-status.html', {
      url: 'https://www.trueachievements.com/game/Gears-of-War-4/achievements'
    });
    setSettings({ 'game.achievements.individualProgress': true });
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');

    await start(individualProgress);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(progressOf(progressHeaders().baseGame)).toEqual({
      trueAchievement: '1,283/1,590',
      gamerscore: '930/1,000',
      achievements: '38/39'
    });
  });

  // The page already shows what a fetch would get, so it's read as it is and kept for the other pages to use
  test('should cache the page itself, rather than fetch it, when every status is shown', async () => {
    const url = 'https://www.trueachievements.com/game/Gears-of-War-4/achievements';
    setHtml('@ta-x-test-views/game-achievements/won-with-dlc.html', { url });
    setSettings({ 'game.achievements.individualProgress': true });
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
    const cacheSpy = vi.spyOn(taxFetch, 'updateMemoizedFetch').mockResolvedValue();
    const served = document.documentElement.outerHTML;

    await start(individualProgress);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(cacheSpy).toHaveBeenCalledExactlyOnceWith(url, served);
  });

  test.each([
    {
      view: '@ta-x-test-views/game-achievements/none-won-with-dlc.html',
      baseGame: { trueAchievement: '0/2,611', gamerscore: '0/1,000', achievements: '0/24' },
      dlc: { trueAchievement: '0/1,150', gamerscore: '0/180', achievements: '0/9' }
    },
    {
      view: '@ta-x-test-views/game-achievements/won-with-dlc.html',
      baseGame: { trueAchievement: '1,283/1,590', gamerscore: '930/1,000', achievements: '38/39' },
      dlc: { trueAchievement: '376/376', gamerscore: '195/195', achievements: '7/7' }
    },
    {
      view: '@ta-x-test-views/game-achievements/won-with-dlc-won-status.html',
      memoizedView: '@ta-x-test-views/game-achievements/won-with-dlc.html',
      baseGame: { trueAchievement: '1,283/1,590', gamerscore: '930/1,000', achievements: '38/39' },
      dlc: { trueAchievement: '376/376', gamerscore: '195/195', achievements: '7/7' }
    },
    {
      view: '@ta-x-test-views/game-achievements/won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-test-views/game-achievements/won-with-dlc.html',
      baseGame: { trueAchievement: '1,283/1,590', gamerscore: '930/1,000', achievements: '38/39' },
      dlc: null
    }
  ])(
    "should show each header's TrueAchievement score, gamerscore and achievements if enabled",
    async ({ view, memoizedView, baseGame, dlc }) => {
      setHtml(view);

      setSettings({ 'game.achievements.individualProgress': true });
      const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
      fetchSpy.mockResolvedValueOnce(new Response(readFixture(memoizedView || view)));

      await start(individualProgress);

      const headers = progressHeaders();
      expect(progressOf(headers.baseGame)).toEqual(baseGame);
      expect(progressOf(headers.dlc)).toEqual(dlc);
    }
  );

  // It starts with the other list features once the page is parsed, so it waits for a task of its own
  test('should leave the list alone until it has a task of its own', async () => {
    setHtml('@ta-x-test-views/game-achievements/none-won-with-dlc.html');
    setSettings({ 'game.achievements.individualProgress': true });
    // Its first step reads the game's page (this one shows achievements not won, so it fetches the full list)
    const read = vi
      .spyOn(taxFetch, 'fetchOk')
      .mockResolvedValue(new Response(readFixture('@ta-x-test-views/game-achievements/none-won-with-dlc.html')));

    onTestFinished(individualProgress());

    expect(read).not.toHaveBeenCalled();

    await tick();

    expect(read).toHaveBeenCalledOnce();
  });

  describe('applied live', () => {
    const main = (): string => find('main').innerHTML;
    // The base game's and the DLC's headers as the site serves won-with-dlc.html, and with progress shown
    const served = {
      baseGame: { trueAchievement: '1,590', gamerscore: '1,000', achievements: '39' },
      dlc: { trueAchievement: '376', gamerscore: '195', achievements: '7' }
    };
    const shown = {
      baseGame: { trueAchievement: '1,283/1,590', gamerscore: '930/1,000', achievements: '38/39' },
      dlc: { trueAchievement: '376/376', gamerscore: '195/195', achievements: '7/7' }
    };
    const headers = () => {
      const { baseGame, dlc } = progressHeaders();
      return { baseGame: progressOf(baseGame), dlc: progressOf(dlc) };
    };

    beforeEach(() => {
      // Every status shown, so it reads the page itself
      setHtml('@ta-x-test-views/game-achievements/won-with-dlc.html', {
        url: 'https://www.trueachievements.com/game/Opus-Castle/achievements'
      });
      setSettings({ 'game.achievements.individualProgress': false });
    });

    test("should apply live: on, off and on again from the menu, off giving each header's own text back", async () => {
      await start(individualProgress);
      expect(isAppliedLive(achievements.individualProgress)).toBe(true);
      expect(headers()).toEqual(served);

      await expectAppliesLive(achievements.individualProgress, main);
      expect(headers()).toEqual(shown);
    });

    test("should count each group's achievements when turned on after collapsible groups wrapped them", async () => {
      // Collapsible groups first (each group in a task of its own: no waiting here), as on a page loaded with it on
      vi.spyOn(taxLib, 'yieldToPage').mockResolvedValue(undefined);
      setSettings({ 'game.achievements.collapsibleGroups': true });
      onTestFinished(collapsibleGroups());
      await start(individualProgress);
      const wrapped = main();

      await changeSettingLive(achievements.individualProgress, true);
      expect(headers()).toEqual(shown);

      await changeSettingLive(achievements.individualProgress, false);
      expect(main()).toBe(wrapped);
    });

    test('should read nothing when turned off while it waits for its task', async () => {
      await start(individualProgress);
      const cacheSpy = vi.spyOn(taxFetch, 'updateMemoizedFetch');
      const before = main();

      // On, and off again before its task came
      setSettings({ 'game.achievements.individualProgress': true });
      setSettings({ 'game.achievements.individualProgress': false });
      await tick();

      expect(cacheSpy).not.toHaveBeenCalled();
      expect(main()).toBe(before);
    });
  });
});
