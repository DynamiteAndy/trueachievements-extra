import fs from 'node:fs';
import { resolve } from 'node:path';

import tsconfig from '../../tsconfig.json' with { type: 'json' };

// The fixtures' alias (`@ta-x-test-views/…`) and the folder tsconfig maps it to (test/html), from the repo's root
// rather than the working folder
const alias = '@ta-x-test-views/';
const folder = resolve(import.meta.dirname, '../..', tsconfig.compilerOptions.paths[`${alias}*`][0].replace(/\*$/, ''));

const pathOf = (path: string): string => {
  if (!path.startsWith(alias)) {
    throw new Error(`Fixtures are read through ${alias}, not ${path}`);
  }

  return resolve(folder, path.slice(alias.length));
};

// A captured page's markup, by its path (`@ta-x-test-views/…`), for a spec that hands it on as text: a fetched page a
// stub answers with, or markup added to the page
export const readFixture = (path: string): string => fs.readFileSync(pathOf(path), 'utf8');

// A captured page parsed on its own, off the page under test: a page our script reads after fetching it (a guide site's
// page), or the site's own markup to compare with. A fixture that's only a fragment ends up in its <body>
export const readFixtureDocument = (path: string): Document =>
  new DOMParser().parseFromString(readFixture(path), 'text/html');
