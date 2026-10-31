import { arriveFrom, find, required, setHtml, setSettings, stillParsing, tick } from '@ta-x-test';

import { recordClickedRadios } from '../shared/default-status.spec-helpers';

import { changeToDefaultStatus } from './default-status';

describe('game/achievements/default-status', () => {
  const page = 'https://www.trueachievements.com/game/Gears-of-War-4/achievements';
  let clicked: string[];

  // The page as the site serves it after "Not Won" was picked, arriving from `referrer` (each radio's click is a post
  // back on the site)
  const arrive = (referrer: string, url = page): void => {
    setHtml('@ta-x-test-views/game-achievements/won-with-dlc-not-won-status.html', {
      url
    });
    arriveFrom(referrer);
    clicked = recordClickedRadios();
  };

  const defaultWon = (): void =>
    setSettings({
      'game.achievements.defaultStatus': true,
      'game.achievements.defaultStatusValue': 'rdoWonAchievements'
    });

  // The list's items, taken out so a spec can put them back as the parser would, one at a time
  const takeItems = (): { list: HTMLElement; items: HTMLLIElement[] } => {
    const list = find<HTMLElement>('.ach-panels');
    const items = [...list.querySelectorAll<HTMLLIElement>(':scope > li')];
    items.forEach((item) => item.remove());
    return { list, items };
  };

  test('should leave the filter alone while the default status is off', async () => {
    arrive('https://www.trueachievements.com/game/Gears-of-War-4');

    await changeToDefaultStatus();

    expect(clicked).toEqual([]);
  });

  test('should pick the default on arriving from another page', async () => {
    defaultWon();
    arrive('https://www.trueachievements.com/game/Gears-of-War-4');

    await changeToDefaultStatus();

    expect(clicked).toEqual(['rdoWonAchievements']);
  });

  // Each radio's click is a post back, so clicking the one already showing would reload the page for nothing
  test('should leave the filter alone when the page already shows the default', async () => {
    setSettings({
      'game.achievements.defaultStatus': true,
      'game.achievements.defaultStatusValue': 'rdoNotWonAchievements'
    });
    arrive('https://www.trueachievements.com/game/Gears-of-War-4');

    await changeToDefaultStatus();

    expect(clicked).toEqual([]);
  });

  test("should leave the user's own pick alone after its post back, which arrives from the page itself", async () => {
    // Without this, picking All on a DLC page had the default picked again over it
    defaultWon();
    arrive(page);

    await changeToDefaultStatus();

    expect(clicked).toEqual([]);
  });

  test("should leave another gamer's achievements alone, with their gamerid in the query", async () => {
    defaultWon();
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    arrive('https://www.trueachievements.com/game/Gears-of-War-4', `${page}?gamerid=96119`);

    await changeToDefaultStatus();

    expect(clicked).toEqual([]);
  });

  describe('while the page is still being parsed', () => {
    test('should pick the default as soon as one item not won is parsed, without waiting for the rest', async () => {
      defaultWon();
      arrive('https://www.trueachievements.com/game/Gears-of-War-4');
      stillParsing();
      // A won item first (a copy of the fixture's item not won), then the one not won
      const { list, items } = takeItems();
      const [notWon] = items;
      const won = notWon.cloneNode(true) as HTMLLIElement;
      won.classList.replace('nw', 'w');
      list.append(won);

      const posting = changeToDefaultStatus();
      await tick();

      expect(clicked).toEqual([]);

      list.append(notWon);

      expect(await posting).toBe(true);
      expect(clicked).toEqual(['rdoWonAchievements']);
    });

    test('should wait for the status filter when it is not parsed yet', async () => {
      defaultWon();
      arrive('https://www.trueachievements.com/game/Gears-of-War-4');
      stillParsing();
      const radio = find('#rdoWonAchievements');
      const [parent, next] = [radio.parentElement, radio.nextSibling];
      radio.remove();

      const posting = changeToDefaultStatus();
      await tick();
      required(parent).insertBefore(radio, next);

      expect(await posting).toBe(true);
      expect(clicked).toEqual(['rdoWonAchievements']);
    });

    test('should leave the filter alone once the whole list is parsed with every item won', async () => {
      defaultWon();
      arrive('https://www.trueachievements.com/game/Gears-of-War-4');
      const finishParsing = stillParsing();
      document.querySelectorAll('.ach-panels > li').forEach((item) => item.classList.add('w'));

      const posting = changeToDefaultStatus();
      await tick();

      expect(clicked).toEqual([]);

      finishParsing();

      expect(await posting).toBe(false);
      expect(clicked).toEqual([]);
    });

    test('should give up once the page is parsed without the status filter', async () => {
      defaultWon();
      arrive('https://www.trueachievements.com/game/Gears-of-War-4');
      const finishParsing = stillParsing();
      find('#rdoWonAchievements').remove();

      const posting = changeToDefaultStatus();
      finishParsing();

      expect(await posting).toBe(false);
      expect(clicked).toEqual([]);
    });
  });
});
