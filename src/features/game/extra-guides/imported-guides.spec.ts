import { logger } from '@ta-x-lib';
import { openTab, required, tick } from '@ta-x-test';

import {
  forgetImportedGuides,
  getImportedGuides,
  handOverImportedGuides,
  importedGuides,
  importedGuidesKey,
  importGuidesFrom,
  takeAllHandedOverGuides
} from './imported-guides';

describe('game/extra-guides/imported-guides', () => {
  const guideUrl = 'https://www.xboxachievements.com/game/mass-effect/guide/';
  // Mass Effect's Medal of Honor guide on XboxAchievements
  const guides = [
    {
      title: 'Medal of Honor',
      href: 'https://www.xboxachievements.com/game/mass-effect/achievement/11304-medal-of-honor.html',
      guide: '<p style="text-align:justify">Finish the main quest.</p>'
    }
  ];
  const handOverKey = `importedGuides:${guideUrl}`;

  test.each([
    'https://www.xboxachievements.com/game/mass-effect/guide/',
    'https://www.xboxachievements.com/game/mass-effect/guide',
    'https://www.xboxachievements.com/game/mass-effect/guide?ref=home#overview'
  ])('should keep %s under its address without query or hash, ending in a slash', (url) => {
    expect(importedGuidesKey(url)).toBe(guideUrl);
  });

  test('should have none for a guide page that has not been read', async () => {
    expect(await getImportedGuides(guideUrl)).toBeNull();
  });

  test('should move handed over guides into IndexedDB when they are read, so Tampermonkey storage is emptied', async () => {
    handOverImportedGuides(guideUrl, guides);
    expect(GM_getValue(handOverKey)).toBe(JSON.stringify(guides));

    expect(await getImportedGuides('https://www.xboxachievements.com/game/mass-effect/guide')).toEqual(guides);
    expect(GM_getValue(handOverKey)).toBeUndefined();
    expect(await importedGuides.get(guideUrl)).toEqual(guides);
  });

  test('should move every handed over guide page into IndexedDB, and leave other values alone', async () => {
    const bugVillage = 'https://www.xboxachievements.com/game/bug-village/guide/';
    handOverImportedGuides(guideUrl, guides);
    handOverImportedGuides(bugVillage, []);
    GM_setValue(
      'gameAchievementsXboxAchievementsGuideUrl',
      '[["Mass-Effect","https://www.xboxachievements.com/game/mass-effect/guide/"]]'
    );

    await takeAllHandedOverGuides();

    expect(await importedGuides.get(guideUrl)).toEqual(guides);
    expect(await importedGuides.get(bugVillage)).toEqual([]);
    expect(GM_listValues()).toEqual(['gameAchievementsXboxAchievementsGuideUrl']);
  });

  test('should drop a hand-over that is not a list of guides, and still take the next one', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);
    // Stored before the good one, so it's listed and taken first
    const badKey = 'importedGuides:https://www.xboxachievements.com/game/a-bad-value/guide/';
    GM_setValue(badKey, '[{"title": "cut off');
    handOverImportedGuides(guideUrl, guides);

    await takeAllHandedOverGuides();

    expect(GM_getValue(badKey)).toBeUndefined();
    expect(await importedGuides.get(guideUrl)).toEqual(guides);
    expect(GM_listValues()).toEqual([]);
    expect(warn).toHaveBeenCalledWith('import-guides', `"${badKey}" isn't a list of guides, so it's dropped`);
  });

  test("should keep a hand-over whose guides can't be stored, for a later page", async () => {
    vi.spyOn(importedGuides, 'set').mockRejectedValue(new Error('IndexedDB'));
    handOverImportedGuides(guideUrl, guides);

    await expect(takeAllHandedOverGuides()).rejects.toThrow('IndexedDB');

    expect(GM_getValue(handOverKey)).toBe(JSON.stringify(guides));
  });

  test('should open the guide page in a background tab, and close it once its guides are handed over', async () => {
    const tab = openTab();
    let imported = false;

    const importing = importGuidesFrom(guideUrl).then(() => (imported = true));

    expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(guideUrl, { active: false, insert: true, setParent: true });
    await tick();
    expect(imported).toBe(false);
    expect(tab.close).not.toHaveBeenCalled();

    // Our script on the guide page reads it
    handOverImportedGuides(guideUrl, guides);
    await importing;

    expect(tab.close).toHaveBeenCalledOnce();
    expect(await importedGuides.get(guideUrl)).toEqual(guides);
    expect(GM_getValue(handOverKey)).toBeUndefined();
  });

  test("should still finish, closing the tab, when the handed-over guides can't be stored, keeping them for later", async () => {
    const tab = openTab();
    vi.spyOn(importedGuides, 'set').mockRejectedValue(new Error('IndexedDB'));
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);

    const importing = importGuidesFrom(guideUrl);
    handOverImportedGuides(guideUrl, guides);
    await importing;

    expect(tab.close).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'import-guides',
      "the handed-over guides couldn't be stored",
      expect.any(Error)
    );
    // Left for the maintenance task to take on a later page
    expect(GM_getValue(handOverKey)).toBe(JSON.stringify(guides));
  });

  test.each([
    'http://www.playstationtrophies.org/game/croc-legend-of-the-gobbos/guide/',
    'https://playstationtrophies.org/game/croc-legend-of-the-gobbos/guide',
    'http://playstationtrophies.org/game/croc-legend-of-the-gobbos/guide'
  ])('should finish importing %s from the page the site redirects it to', async (savedUrl) => {
    // Where PlaystationTrophies redirects each of them
    const landedUrl = 'https://www.playstationtrophies.org/game/croc-legend-of-the-gobbos/guide';
    const tab = openTab();

    const importing = importGuidesFrom(savedUrl);
    handOverImportedGuides(landedUrl, guides);
    await importing;

    expect(tab.close).toHaveBeenCalledOnce();
    expect(await getImportedGuides(savedUrl)).toEqual(guides);
  });

  test('should end the import without guides when the tab is closed before they arrive, and stop waiting for them', async () => {
    const tab = openTab();

    const importing = importGuidesFrom(guideUrl);
    // The user closes the tab (e.g. while Cloudflare's check shows)
    required(tab.onclose)();
    await importing;

    expect(await getImportedGuides(guideUrl)).toBeNull();

    // Guides handed over later are no longer the import's: they wait for the next page to move them
    handOverImportedGuides(guideUrl, guides);
    await tick();
    expect(tab.close).not.toHaveBeenCalled();
    expect(GM_getValue(handOverKey)).toBe(JSON.stringify(guides));
  });

  test("should forget one guide page's guides however its address is written, keeping the others", async () => {
    const otherUrl = 'https://www.xboxachievements.com/game/bug-village/guide/';
    await importedGuides.set(guideUrl, guides);
    await importedGuides.set(otherUrl, guides);

    await forgetImportedGuides('https://www.xboxachievements.com/game/mass-effect/guide?ref=home');

    expect(await importedGuides.get(guideUrl)).toBeNull();
    expect(await importedGuides.get(otherUrl)).toEqual(guides);
  });
});
