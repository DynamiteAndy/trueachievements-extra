import { getAccordions, getSettings, mountInPage, setHtml, setSettings, shownSettings } from '@ta-x-test';

import { ClipsSettings } from './ClipsSettings';

describe('game/clips/ClipsSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({ 'game.clips.defaultStatus': true });

    expect(getSettings(<ClipsSettings />)).toEqual([
      ['ta-x-game-clips-default-status', 'game.clips.defaultStatus'],
      ['ta-x-game-clips-default-recorded-by-value', 'game.clips.defaultRecordedByValue'],
      ['ta-x-game-clips-default-saved-by-value', 'game.clips.defaultSavedByValue'],
      ['ta-x-game-clips-default-recorded-value', 'game.clips.defaultRecordedValue'],
      ['ta-x-game-clips-default-sort-by-value', 'game.clips.defaultSortByValue']
    ]);
  });

  test("should offer exactly the options of the site's own filters", () => {
    setHtml('@ta-x-test-views/game-videos/filters.html');
    const options = (select: string) =>
      [...document.querySelectorAll<HTMLOptionElement>(`${select} option`)].map(({ value, text }) => [value, text]);
    const site = ['#ddlRecordedBy', '#ddlSavedBy', '#ddlUploaded', '#ddlOrder'].map(options);
    setSettings({ 'game.clips.defaultStatus': true });

    const { container } = mountInPage(<ClipsSettings />);
    const ours = [
      'ta-x-game-clips-default-recorded-by-value',
      'ta-x-game-clips-default-saved-by-value',
      'ta-x-game-clips-default-recorded-value',
      'ta-x-game-clips-default-sort-by-value'
    ].map((id) =>
      [...container.querySelectorAll<HTMLOptionElement>(`#${id} option`)].map(({ value, text }) => [
        // The setting stores the site's "Anyone" (an option without a value) as ''
        value === '' ? text : value,
        text
      ])
    );

    expect(site.map((list) => list.length)).toEqual([3, 3, 4, 5]);
    expect(ours).toEqual(site);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<ClipsSettings />)).toEqual(['Clips']);
  });

  test('should leave out the settings that depend on the default status while that is off', () => {
    expect(shownSettings(<ClipsSettings />)).toEqual(['ta-x-game-clips-default-status']);
  });
});
