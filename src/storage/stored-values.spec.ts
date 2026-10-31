import fs from 'node:fs';
import path from 'node:path';

import { migrations, runMigrations, storageVersionKey } from './migrations';
import { settingsList } from './settings-tree';

// Every value the script keeps in Tampermonkey storage, by key or key prefix, with the file that owns it. Users' data
// lives under these keys, so a key that's renamed or dropped needs a migration (migrations.ts). The settings are
// declared through settingsList(); settings-keys.spec.ts pins their keys and defaults.
const declared: { key: string; prefix?: true; owner: string; holds: string }[] = [
  ...settingsList().map(({ path: settingPath, setting }) => ({
    key: setting.key,
    owner: 'storage/settings-tree.ts',
    holds: `the setting ${settingPath}`
  })),
  {
    key: 'gameAchievementsXboxAchievementsGuideUrl',
    owner: 'features/game/extra-guides/guide-links.ts',
    holds: "each game's linked XboxAchievements guide pages"
  },
  {
    key: 'gameAchievementsPlaystationTrophiesGuideUrl',
    owner: 'features/game/extra-guides/guide-links.ts',
    holds: "each game's linked PlayStationTrophies guide pages"
  },
  {
    key: 'gameAchievementsGamertagNationGuideUrl',
    owner: 'features/game/extra-guides/guide-links.ts',
    holds: "each game's linked GamertagNation guide pages"
  },
  {
    key: 'walkthroughOwnerProgressUrl',
    owner: 'features/forum/view-thread/show-owner-progress/owner-progress-urls.ts',
    holds:
      "each walkthrough thread's walkthrough page, as kept in Tampermonkey storage, until it's carried over to IndexedDB"
  },
  {
    key: 'previewWalkthroughId',
    owner: 'features/staff/walkthrough/walkthrough-preview/preview-page-walkthroughs.ts',
    holds: "each walkthrough's page ids, as kept in Tampermonkey storage, until they're carried over to IndexedDB"
  },
  {
    key: 'giveawayAutoOptInTried',
    owner: 'features/all-pages/giveaway-auto-opt-in/index.tsx',
    holds: 'the giveaway last posted, so it is posted at most once'
  },
  {
    key: 'giveawayAutoOptInClaimed',
    owner: 'features/all-pages/giveaway-auto-opt-in/index.tsx',
    holds: 'the giveaway a tab is posting and when, so tabs loading together post it once'
  },
  {
    key: 'importedGuides:',
    prefix: true,
    owner: 'features/game/extra-guides/imported-guides.ts',
    holds: "a guide page's guides handed over from a guide site, until a TrueAchievements page takes them"
  },
  { key: storageVersionKey, owner: 'storage/migrations.ts', holds: 'the version of the last migration run' }
];

// The Tampermonkey storage calls; any file making one must own a declared value (or be setting.ts, stored.ts or
// carry-over.ts, which setting(), stored() and carryOverToIndexedDb() calls go through, the last with its legacyKey
// named in its owner file)
const storageCall = /\bGM_(?:getValue|setValue|deleteValue|listValues|addValueChangeListener)\b/;
const storageFiles = [
  'storage/setting.ts',
  'storage/stored.ts',
  'storage/carry-over.ts',
  ...new Set(declared.map(({ owner }) => owner))
];

// Every string passed as a key, directly or through stored(), and every legacy key a carry-over names
const literalKeys = (source: string): string[] =>
  [
    ...source.matchAll(/\b(?:GM_(?:getValue|setValue|deleteValue)|stored(?:<[^>]*>)?|legacyKey =)\s*\(?\s*'([^']*)'/g)
  ].map(([, key]) => key);

const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(file);
    }

    return /\.tsx?$/.test(entry.name) && !/\.(spec|bench)\.tsx?$/.test(entry.name) ? [file] : [];
  });

// A file's code without its comments (one mentions GM_setValue in passing)
const code = (file: string): string =>
  fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

const src = path.resolve(import.meta.dirname, '..');
const read = (file: string): string => code(path.join(src, file));

describe('stored values', () => {
  test('are declared once each, and no key falls under a declared prefix', () => {
    const keys = declared.map(({ key }) => key);
    const prefixes = declared.filter(({ prefix }) => prefix).map(({ key }) => key);

    expect(keys.filter((key, index) => keys.indexOf(key) !== index)).toEqual([]);
    expect(declared.filter(({ key, prefix }) => !prefix && prefixes.some((start) => key.startsWith(start)))).toEqual(
      []
    );
  });

  test('are only read or written by the files that own them', () => {
    const callers = sourceFiles(src)
      .filter((file) => storageCall.test(code(file)))
      .map((file) => path.relative(src, file).replaceAll('\\', '/'));

    expect(callers.filter((file) => !storageFiles.includes(file))).toEqual([]);
  });

  // A key a file reads or writes without declaring it fails here: declare it above, or add a migration if it's old
  test.each(storageFiles.filter((file) => file !== 'storage/migrations.ts'))(
    'every key %s names is declared',
    (file) => {
      const keys = declared.map(({ key }) => key);

      expect(literalKeys(read(file)).filter((key) => !keys.includes(key))).toEqual([]);
    }
  );

  // So a declaration can't outlive its value
  test.each(declared.filter(({ owner }) => owner !== 'storage/settings-tree.ts'))(
    '$key is still named in $owner',
    ({ key, owner }) => {
      expect(read(owner)).toContain(key === storageVersionKey ? 'storageVersionKey' : `'${key}'`);
    }
  );

  test('survive every migration', () => {
    declared.forEach(({ key, prefix }) => GM_setValue(prefix ? `${key}https://example.com/guide/` : key, '[]'));
    const before = GM_listValues().toSorted();

    runMigrations(migrations);

    expect(GM_listValues().toSorted()).toEqual(before);
  });
});
