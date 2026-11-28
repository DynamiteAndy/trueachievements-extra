import { createMetadata, header } from '../../build/metadata';

import type { UserscriptMetadata } from '../../build/metadata';

describe('build/metadata header', () => {
  const metadata = (overrides: Partial<UserscriptMetadata> = {}): UserscriptMetadata => ({
    ...createMetadata('prod'),
    match: ['https://a.example/*', 'https://b.example/*'],
    grant: ['GM_getValue'],
    require: [],
    ...overrides
  });
  const entryLines = (text: string): string[] => text.split('\n').slice(1, -1);

  test('should wrap the lines in the userscript markers', () => {
    const lines = header(metadata()).split('\n');

    expect(lines[0]).toBe('// ==UserScript==');
    expect(lines.at(-1)).toBe('// ==/UserScript==');
  });

  test('should start every value three spaces after the longest key', () => {
    const entries = entryLines(header(metadata())).map((line) => /^\/\/ @(\S+)( +)(\S.*)$/.exec(line));
    const width = Math.max(...entries.map((entry) => entry?.[1].length ?? 0)) + 3;

    expect(entries.every((entry) => entry !== null && entry[1].length + entry[2].length === width)).toBe(true);
  });

  test('should give one line for each value of a list', () => {
    const matches = entryLines(header(metadata())).filter((line) => line.startsWith('// @match '));

    expect(matches.map((line) => line.split(/\s+/).at(-1))).toEqual(['https://a.example/*', 'https://b.example/*']);
  });

  // Installs update from the latest GitHub Release; dist/ on main keeps only the release that moved them there
  test.each([
    ['prod', 'trueachievements-extras.user.js'],
    ['prod-min', 'trueachievements-extras.min.user.js']
  ] as const)('should point the %s script at its file in the latest GitHub Release', (variant, file) => {
    const { updateURL, downloadURL } = createMetadata(variant);
    const expected = `https://github.com/dynamiteandy/trueachievements-extra/releases/latest/download/${file}`;

    expect(updateURL).toBe(expected);
    expect(downloadURL).toBe(expected);
  });

  test('should give the dev script no update URLs', () => {
    const { updateURL, downloadURL } = createMetadata('dev');

    expect(updateURL).toBeUndefined();
    expect(downloadURL).toBeUndefined();
  });

  test('should leave out undefined entries and empty lists', () => {
    const text = header(metadata({ updateURL: undefined, downloadURL: undefined, description: 'x' }));

    expect(text).not.toContain('@updateURL');
    expect(text).not.toContain('@downloadURL');
    expect(text).not.toContain('@require');
    expect(text).toContain('\n// @description   x\n');
  });
});
