import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import packageJson from '../package.json' with { type: 'json' };

const { author, url, description, version, bugs } = packageJson;

// Tampermonkey reads the header from the installed script: after changing it, reinstall the dev script from
// dist/trueachievements-extras.dev.user.js

// Where the release scripts are served from, the latest GitHub Release's files: createMetadata adds the script's file
// name for the update URLs
const releaseFolderUrl = `${url}/releases/latest/download/`;

export interface UserscriptMetadata {
  name: string;
  namespace: string;
  version: string;
  iconURL: string;
  icon64URL: string;
  updateURL?: string;
  downloadURL?: string;
  supportURL: string;
  description: string;
  author: string;
  match: string[];
  'run-at': string;
  grant: string[];
  require: string[];
}

type Variant = 'dev' | 'prod' | 'prod-min';

export const scriptFilename = (variant: 'prod' | 'prod-min'): string =>
  variant === 'prod-min' ? 'trueachievements-extras.min.user.js' : 'trueachievements-extras.user.js';

// A new object each call, so one build's entries never reach another built in the same process
const releaseMetadata = (): UserscriptMetadata => ({
  name: 'TrueAchievements Extra',
  namespace: 'dynamite-andy',
  version,
  // By raw/main: one redirect shorter than blob/main/…?raw=true
  iconURL: `${url}/raw/main/src/resources/icons/favicon32x32.ico`,
  icon64URL: `${url}/raw/main/src/resources/icons/favicon64x64.ico`,
  // Filled in by createMetadata for the release scripts; listed here so they keep their place in the header
  updateURL: undefined,
  downloadURL: undefined,
  supportURL: bugs.url,
  description,
  author,
  // Guide sites whose guides are read when the user visits them (their pages block background requests)
  match: [
    'http*://*.trueachievements.com/*',
    'https://www.xboxachievements.com/game/*/guide*',
    'https://www.playstationtrophies.org/game/*/guide*',
    'https://www.gamertagnation.com/game/*/guides*'
  ],
  'run-at': 'document-start',
  grant: [
    'GM_getValue',
    'GM_setValue',
    'GM_deleteValue',
    'GM_listValues',
    'GM_addValueChangeListener',
    'GM_removeValueChangeListener',
    'GM_openInTab',
    'GM_addStyle'
  ],
  require: []
});

export const createMetadata = (variant: Variant): UserscriptMetadata => {
  const metadata = releaseMetadata();

  if (variant === 'dev') {
    metadata.name += ' - Development';
    // The Preact DevTools hook is on the page's window (src/dev/devtools-hook.ts); dev builds only
    metadata.grant.push('unsafeWindow');
    // A proper file address on every platform (a `#` or `?` in the repo's path is escaped)
    metadata.require.push(pathToFileURL(join(import.meta.dirname, '../dist/trueachievements-extras.debug.js')).href);
  } else {
    metadata.updateURL = `${releaseFolderUrl}${scriptFilename(variant)}`;
    metadata.downloadURL = `${releaseFolderUrl}${scriptFilename(variant)}`;
  }

  return metadata;
};

// One `// @key value` line per value, keys padded to line the values up; an undefined entry gives no line
export const header = (metadata: UserscriptMetadata): string => {
  const entries = Object.entries(metadata).flatMap(([key, value]: [string, string | string[] | undefined]) =>
    [value ?? []].flat().map((item) => [key, item])
  );
  const width = Math.max(...entries.map(([key]) => key.length)) + 3;

  return [
    '// ==UserScript==',
    ...entries.map(([key, value]) => `// @${key.padEnd(width)}${value}`),
    '// ==/UserScript=='
  ].join('\n');
};
