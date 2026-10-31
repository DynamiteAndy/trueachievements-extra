import * as taxFetch from '@ta-x-fetch';
import { isAppliedLive, settings, type Setting } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, readFixture, setSettings, tick } from '@ta-x-test';

import { baseGroupHeader, dlcGroupHeader, groupStats } from './achievement-groups';

// For the individual progress specs (achievements, DLC and challenges pages)

// The page's headers whose stats individual progress rewrites: the base game's and the DLC's, null where the page has
// none (on Not Won, the DLC's is the site's)
export const progressHeaders = (): { baseGame: HTMLElement | null; dlc: HTMLElement | null } => ({
  baseGame: document.querySelector<HTMLElement>(baseGroupHeader),
  dlc: document.querySelector<HTMLElement>(dlcGroupHeader)
});

export type Progress = { trueAchievement: string; gamerscore: string; achievements: string };

// A header's three stats as shown, or null for a header the page doesn't have (so a table row expecting none can't
// pass whatever the feature did)
export const progressOf = (header: HTMLElement | null): Progress | null =>
  header && {
    trueAchievement: find<HTMLElement>(groupStats.taScore, header).innerText,
    gamerscore: find<HTMLElement>(groupStats.gamerscore, header).innerText,
    achievements: find<HTMLElement>(groupStats.achievements, header).innerText
  };

// Starts a page's individual progress, stopping it when the test ends, and lets it read the list and write the headers
// (it waits for a task of its own, then reads the page or fetches it)
export const start = async (individualProgress: () => () => void): Promise<void> => {
  onTestFinished(individualProgress());
  await tick();
};

// Starts `individualProgress` where it should do nothing: had it gone on, it would have read `fullList` (or, with every
// status shown, cached the page itself) and rewritten the headers' stats
export const expectNotRun = async (individualProgress: () => () => void, fullList: string): Promise<void> => {
  const memoizeFetchSpy = vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue(readFixture(fullList));
  const cacheSpy = vi.spyOn(taxFetch, 'updateMemoizedFetch');
  const served = find('main').innerHTML;

  await start(individualProgress);

  expect(memoizeFetchSpy).not.toHaveBeenCalled();
  expect(cacheSpy).not.toHaveBeenCalled();
  expect(find('main').innerHTML).toBe(served);
};

// The DLC and challenges pages' own individual progress setting, with its override of the achievements page's on
const overrides = {
  dlc: 'game.dlc.overrideAchievementsPageSettings',
  challenges: 'game.challenges.overrideAchievementsIndividualProgress'
};
export const setOwnProgress = (page: keyof typeof overrides, on: boolean): void =>
  setSettings({ [overrides[page]]: true, [`game.${page}.individualProgress`]: on });

// The DLC and challenges pages' "applied live" specs: each picks between its own setting and the achievements page's,
// by its override. `open` loads the page (and stubs what it fetches); `read` is the header the page rewrites, `served`
// its stats as the site sends them and `shown` as individual progress writes them; `registered` every setting it reads
export const describeOverrideLive = (
  page: keyof typeof overrides,
  {
    individualProgress,
    open,
    read,
    served,
    shown,
    own,
    override,
    registered
  }: {
    individualProgress: () => () => void;
    open: () => void;
    read: () => Progress | null;
    served: Progress;
    shown: Progress;
    own: Setting<boolean>;
    override: Setting<boolean>;
    registered: Setting[];
  }
): void => {
  describe('applied live', () => {
    const achievementsSetting = settings.game.achievements.individualProgress;
    const main = (): string => find('main').innerHTML;

    beforeEach(open);

    test("should apply the achievements' setting live while the override is off", async () => {
      setSettings({ 'game.achievements.individualProgress': false });
      await start(individualProgress);
      expect(read()).toEqual(served);

      await expectAppliesLive(achievementsSetting, main);
      expect(read()).toEqual(shown);
    });

    test('should apply its own setting live while the override is on', async () => {
      setOwnProgress(page, false);
      await start(individualProgress);

      await expectAppliesLive(own, main);
      expect(read()).toEqual(shown);
    });

    test("should follow its override live, giving each header its own text back when it picks a setting that's off", async () => {
      setSettings({ 'game.achievements.individualProgress': true });
      setOwnProgress(page, false);
      setSettings({ [overrides[page]]: false });
      await start(individualProgress);
      expect(read()).toEqual(shown);

      await changeSettingLive(override, true);
      expect(read()).toEqual(served);

      await changeSettingLive(override, false);
      expect(read()).toEqual(shown);
    });

    test('should register every setting it reads as applied live, and none once stopped', async () => {
      const live = () => registered.map(isAppliedLive);
      const stop = individualProgress();

      expect(live()).toEqual(registered.map(() => true));

      stop();

      expect(live()).toEqual(registered.map(() => false));
    });
  });
};
