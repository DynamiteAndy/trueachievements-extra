import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve(import.meta.dirname, '../../src');

// Each styles.ts, with the class names, js- hooks and custom properties it defines (one per key, in order)
const stylesFiles = (fs.readdirSync(src, { recursive: true }) as string[])
  .filter((file) => path.basename(file) === 'styles.ts')
  .map((file) => ({
    file: file.split(path.sep).join('/'),
    names: [...fs.readFileSync(path.join(src, file), 'utf8').matchAll(/'((?:js-|--)?ta-x-[a-z0-9-]+)'/g)].map(
      ([, name]) => name
    )
  }));

// Our class names are short (ta-x-, the feature, then its part), so nothing in their folder keeps two features' names
// apart: two styles.ts files, or two keys of one, defining one name would share each other's rules (or, for a js- hook,
// each other's queries)
describe('class names', () => {
  test('are each defined by one styles.ts only', () => {
    const owners = new Map<string, string[]>();
    stylesFiles.forEach(({ file, names }) =>
      new Set(names).forEach((name) => owners.set(name, [...(owners.get(name) ?? []), file]))
    );

    expect([...owners].filter(([, files]) => files.length > 1)).toEqual([]);
  });

  test('are each given to one key of their styles.ts', () => {
    expect(
      stylesFiles.flatMap(({ file, names }) =>
        names.filter((name, index) => names.indexOf(name) !== index).map((name) => `${file}: ${name}`)
      )
    ).toEqual([]);
  });

  test('finds the styles.ts files and their names', () => {
    expect(stylesFiles.length).toBeGreaterThan(20);
    expect(stylesFiles.flatMap(({ names }) => names)).toEqual(
      expect.arrayContaining(['ta-x-wishlist-pill', 'js-ta-x-theme-toggle', '--ta-x-sticky-toolbar-floating-menu'])
    );
  });
});
