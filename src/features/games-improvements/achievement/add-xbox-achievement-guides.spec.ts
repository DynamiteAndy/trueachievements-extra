import each from 'jest-each';
import { readFileSync } from 'fs-extra';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-jest';
import { Cache, Constants, AchievementsRegex, gameAchievements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import * as sharedFeatures from '../shared';
import addXboxAchievementGuides from './add-xbox-achievement-guides';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

jest.mock('@ta-x-helpers', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-helpers')
  };
});

jest.mock('../shared', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../shared')
  };
});

describe('games-improvements/achievement/add-xbox-achievement-guides', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(false);
    const addXboxAchievementGuidesSpy = jest.spyOn(sharedFeatures, 'addXboxAchievementGuides');

    await addXboxAchievementGuides();

    expect(addXboxAchievementGuidesSpy).not.toHaveBeenCalled();
    addXboxAchievementGuidesSpy.mockRestore();
  });

  it('should not run if game heading does not load', async () => {
    jest.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);

    await addXboxAchievementGuides();

    expect(
      document.querySelector(`.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`)
    ).toBe(null);
    expect(
      document.querySelector(`.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesStyle}`)
    ).toBe(null);
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html'
    }
  ]).test('should ask for url if no url is configured', async ({ view }) => {
    setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      inputValue: ''
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      inputValue: ''
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      inputValue: 'invalid-url'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      inputValue: 'invalid-url'
    }
  ]).test('should ignore invalid urls when url is asked for', async ({ view, inputValue }) => {
    setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    jest.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);

    const memoizeCorsFetchSpy = jest.spyOn(taxHelpers, 'memoizeCorsFetch');

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    const input = document.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;
    input.value = inputValue;
    input.dispatchEvent(new window.Event('input', { bubbles: true, cancelable: false }));

    const button = document.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
    button.dispatchEvent(
      new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    memoizeCorsFetchSpy.mockRestore();
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      inputValue: 'https://www.xboxachievements.com/game/g-force/guide/',
      memoizedView: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      inputValue: 'https://www.xboxachievements.com/game/g-force/guide/',
      memoizedView: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    }
  ]).test('should fetch valid url when url is asked for', async ({ view, inputValue, memoizedView }) => {
    setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    jest.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);

    const memoizeCorsFetchSpy = jest.spyOn(taxHelpers, 'memoizeCorsFetch');
    memoizeCorsFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView)).toString());

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    const input = document.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;
    input.value = inputValue;
    input.dispatchEvent(new window.Event('input', { bubbles: true, cancelable: false }));

    const button = document.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
    button.dispatchEvent(
      new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    );

    await taxHelpers.wait(1);

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(memoizeCorsFetchSpy).toHaveBeenCalled();

    const guide = document.querySelector('.ta-x-games-improvements-achievements-achievement-guide');

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(guide).not.toBe(null);
    expect((guide.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeCorsFetchSpy.mockRestore();
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-guide.html',
      cachedGuide: new Map([['GForce', 'https://www.xboxachievements.com/game/g-force/guide/']]),
      memoizedView: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/achievement-with-no-guide.html',
      cachedGuide: new Map([['GForce', 'https://www.xboxachievements.com/game/g-force/guide/']]),
      memoizedView: '@ta-x-jest-views/games-improvements/achievement/add-xbox-achievement-guides/gforce.html'
    }
  ]).test('should display guide for achievement', async ({ view, cachedGuide, memoizedView }) => {
    setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameAchievementsShowXboxAchievementGuides', 'get').mockReturnValueOnce(true);
    jest.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);
    jest.spyOn(Cache, 'gameAchievementsXboxAchievementsGuideUrl', 'get').mockReturnValueOnce(cachedGuide);

    const memoizeCorsFetchSpy = jest.spyOn(taxHelpers, 'memoizeCorsFetch');
    memoizeCorsFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView)).toString());

    await addXboxAchievementGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`
    );

    const guide = document.querySelector('.ta-x-games-improvements-achievements-achievement-guide');

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(guide).not.toBe(null);
    expect((guide.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeCorsFetchSpy.mockRestore();
  });
});
