// pnpm fixture:condense <captured.html> <out.html> --page <url> --date <YYYY-MM-DD>
//   --note "<what it's for, what was cut>" [--keep "<selector>"]… [--rows "<selector>=<i,j,…>"]…
//   [--keep-hidden "<name>"]… [--keep-query "<name>"]…
// Writes the condensed fixture (condense.ts). The capture itself stays a live step in the browser (live-site.md).
import fs from 'node:fs';

import { condense, type CondenseOptions } from './condense.ts';

const usage =
  'Usage: pnpm fixture:condense <captured.html> <out.html> --page <url> --date <YYYY-MM-DD> --note "…"' +
  ' [--keep "<selector>"]… [--rows "<selector>=<i,j,…>"]… [--keep-hidden "<name>"]… [--keep-query "<name>"]…';

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  fail(usage);
}

const options: CondenseOptions = { page: '', date: '', note: '', keep: [], rows: [], keepHidden: [], keepQuery: [] };
for (let i = 0; i < flags.length; i += 2) {
  const [flag, value] = [flags[i], flags[i + 1] ?? ''];
  if (flag === '--page') {
    options.page = value;
  } else if (flag === '--date') {
    options.date = value;
  } else if (flag === '--note') {
    // pnpm hands on a note typed across lines with its line breaks as a literal \n
    options.note = value.replaceAll('\\n', '\n');
  } else if (flag === '--keep') {
    options.keep?.push(value);
  } else if (flag === '--keep-hidden') {
    options.keepHidden?.push(value);
  } else if (flag === '--keep-query') {
    options.keepQuery?.push(value);
  } else if (flag === '--rows') {
    // Without the "=", or with an index that isn't a whole number, the cut would quietly match nothing
    const at = value.lastIndexOf('=');
    const indices = value.slice(at + 1).split(',');
    if (at < 1 || indices.some((index) => !/^\d+$/.test(index))) {
      fail(`--rows takes "<selector>=<i,j,…>", not "${value}"\n${usage}`);
    }
    options.rows?.push({ selector: value.slice(0, at), indices: indices.map(Number) });
  } else {
    fail(`Unknown option ${flag}\n${usage}`);
  }
}
if (!options.page || !options.note) {
  fail('--page and --note are needed: the fixture says where it came from and what was cut');
}

fs.writeFileSync(output, condense(fs.readFileSync(input, 'utf8'), options));
console.log(`wrote ${output}`);
