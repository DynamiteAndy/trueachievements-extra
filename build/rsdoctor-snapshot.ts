// `pnpm run analyse:snapshot <name>`: keeps the last `pnpm run analyse` report as dist/local/rsdoctor-<name>, for
// `pnpm run analyse:diff` to compare `before` with `after`. The report's manifest names each of its data files by
// absolute path, so the copy's manifest is pointed at the copied files: otherwise it would read whatever the next
// analyse writes, and the diff would compare that build with itself
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv[2];

if (!name || !/^[\w-]+$/.test(name)) {
  console.error(
    'Usage: pnpm run analyse:snapshot <name> (letters, digits, - or _; analyse:diff compares before and after)'
  );
  process.exit(1);
}

const report = join(import.meta.dirname, '../dist/local/analyse/.rsdoctor');
const snapshot = join(import.meta.dirname, `../dist/local/rsdoctor-${name}`);
const manifestPath = join(snapshot, 'manifest.json');

if (!existsSync(join(report, 'manifest.json'))) {
  console.error(`No Rsdoctor report at ${report}: run pnpm run analyse first`);
  process.exit(1);
}

rmSync(snapshot, { recursive: true, force: true });
cpSync(report, snapshot, { recursive: true });

// The paths are JSON strings in the manifest, with their backslashes escaped
const asInJson = (path: string): string => JSON.stringify(path).slice(1, -1);
const manifest = readFileSync(manifestPath, 'utf8');
writeFileSync(manifestPath, manifest.replaceAll(asInJson(report), asInJson(snapshot)));

console.log(`Saved ${manifestPath}`);
