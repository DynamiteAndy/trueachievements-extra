import { arriveFrom, find, recordEvents, setHtml, setSettings } from '@ta-x-test';

import { changeToDefaultStatus } from './default-status';

describe('game/clips/default-status', () => {
  let changes: string[];

  const values = (): string[] =>
    ['#ddlRecordedBy', '#ddlSavedBy', '#ddlUploaded', '#ddlOrder'].map(
      (selector) => find<HTMLSelectElement>(selector).value
    );

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-videos/filters.html');
    // Each change event is a post back on the site (the dropdowns' onchange runs Postback)
    changes = recordEvents('change', (event) => (event.target as HTMLElement).id);
  });

  const untouched = ['Anyone', 'Gamer', '7', 'Most viewed'];

  test.each([
    {
      name: 'leave the filters alone while the default status is off',
      settings: { 'game.clips.defaultRecordedValue': '0' },
      expected: untouched,
      postedBack: []
    },
    {
      name: 'not post back when the filters already match',
      settings: { 'game.clips.defaultStatus': true },
      expected: untouched,
      postedBack: []
    },
    {
      name: 'set every dropdown that differs and post back once',
      settings: {
        'game.clips.defaultStatus': true,
        'game.clips.defaultRecordedByValue': 'Me',
        'game.clips.defaultRecordedValue': '0',
        'game.clips.defaultSortByValue': 'Longest'
      },
      expected: ['Me', 'Gamer', '0', 'Longest'],
      postedBack: ['ddlOrder']
    },
    {
      name: 'choose the site\'s "Anyone", which the setting stores as an empty value',
      settings: { 'game.clips.defaultStatus': true, 'game.clips.defaultSavedByValue': '' },
      expected: ['Anyone', 'Anyone', '7', 'Most viewed'],
      postedBack: ['ddlSavedBy']
    },
    // e.g. a choice the site has since dropped
    {
      name: 'leave a dropdown alone when the stored value is none of its options',
      settings: { 'game.clips.defaultStatus': true, 'game.clips.defaultRecordedValue': '90' },
      expected: untouched,
      postedBack: []
    }
  ])('should $name', async ({ settings, expected, postedBack }) => {
    setSettings(settings);

    await changeToDefaultStatus();

    expect(values()).toEqual(expected);
    expect(changes).toEqual(postedBack);
  });

  test('should apply only on arriving, so a filter the user picks afterwards sticks', async () => {
    setSettings({
      'game.clips.defaultStatus': true,
      'game.clips.defaultRecordedValue': '0'
    });

    await changeToDefaultStatus();
    // The user picks This month; the site posts the page back to itself, so it loads again from its own address
    setHtml('@ta-x-test-views/game-videos/filters.html');
    arriveFrom(window.location.href);
    find<HTMLSelectElement>('#ddlUploaded').value = '30';
    await changeToDefaultStatus();

    expect(values()).toEqual(['Anyone', 'Gamer', '30', 'Most viewed']);
    expect(changes).toEqual(['ddlUploaded']);
  });
});
