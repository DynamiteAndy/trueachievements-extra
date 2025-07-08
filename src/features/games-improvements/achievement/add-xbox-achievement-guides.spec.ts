import fs from 'node:fs';
import { getPath } from '@ta-x-build-helpers';
import { setHtml } from '@ta-x-test';
import { Cache, Constants, AchievementsRegex, gameAchievements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import addXboxAchievementGuides from './import-guides';
import styles from '../shared/styles';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));
vi.mock('@ta-x-helpers', async () => await vi.importActual('@ta-x-helpers'));

describe('games-improvements/achievement/add-xbox-achievement-guides', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if game heading does not load', async () => {
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);

    await addXboxAchievementGuides();

    expect(
      document.querySelector(`.${styles.jsXboxAchievementGuides}`)
    ).toBe(null);
    expect(
      document.querySelector(`.${styles.xboxAchievementGuides}`)
    ).toBe(null);
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html'
    }
  ])('should not display if not enabled', async ({ view }) => {
    await setHtml(view);
    vi.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(false);

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${styles.jsXboxAchievementGuides}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html'
    }
  ])('should ask for url if no url is configured', async ({ view }) => {
    await setHtml(view);

    vi.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${styles.jsXboxAchievementGuides}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${styles.jsAskLoaderAsk}`)).not.toBe(null);
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      inputValue: ''
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      inputValue: ''
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      inputValue: 'invalid-url'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      inputValue: 'invalid-url'
    }
  ])('should ignore invalid urls when url is asked for', async ({ view, inputValue }) => {
    await setHtml(view);

    vi.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);

    const memoizeCorsFetchSpy = vi.spyOn(taxHelpers, 'memoizeCorsFetch');

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${styles.jsXboxAchievementGuides}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${styles.jsAskLoaderAsk}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    const input = document.querySelector(`.${styles.jsAskLoaderInput}`) as HTMLInputElement;
    input.value = inputValue;
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: false }));

    const button = document.querySelector(`.${styles.jsAskLoaderAskButton}`);
    button.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${styles.jsAskLoaderAsk}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    memoizeCorsFetchSpy.mockRestore();
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      inputValue: 'https://www.xboxachievements.com/game/g-force/guide/',
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      inputValue: 'https://www.xboxachievements.com/game/g-force/guide/',
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    }
  ])('should fetch valid url when url is asked for', async ({ view, inputValue, memoizedView }) => {
    await setHtml(view);

    vi.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);

    const memoizeCorsFetchSpy = vi.spyOn(taxHelpers, 'memoizeCorsFetch');
    memoizeCorsFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView), 'utf8'));

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${styles.jsXboxAchievementGuides}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${styles.jsAskLoaderAsk}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    const input = extensionBody.querySelector(`.${styles.jsAskLoaderInput}`) as HTMLInputElement;
    input.value = inputValue;
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: false }));

    const button = extensionBody.querySelector(`.${styles.jsAskLoaderAskButton}`);
    button.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    await taxHelpers.wait(1);

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(memoizeCorsFetchSpy).toHaveBeenCalled();

    const guide = document.querySelector(`.${styles.achievementGuideSolution}`);

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(guide).not.toBe(null);
    expect((guide.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeCorsFetchSpy.mockRestore();
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      cachedGuide: new Map([['GForce', 'https://www.xboxachievements.com/game/g-force/guide/']]),
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      cachedGuide: new Map([['GForce', 'https://www.xboxachievements.com/game/g-force/guide/']]),
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    }
  ])('should display guide for achievement', async ({ view, cachedGuide, memoizedView }) => {
    await setHtml(view);

    vi.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);
    vi.spyOn(Cache, 'gameAchievementsXboxAchievementsGuideUrl', 'get').mockReturnValueOnce(cachedGuide);

    const memoizeCorsFetchSpy = vi.spyOn(taxHelpers, 'memoizeCorsFetch');
    memoizeCorsFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView), 'utf8'));

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${styles.jsXboxAchievementGuides}`
    );

    const guide = document.querySelector(`.${styles.achievementGuideSolution}`);

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(guide).not.toBe(null);
    expect((guide.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeCorsFetchSpy.mockRestore();
  });
});
