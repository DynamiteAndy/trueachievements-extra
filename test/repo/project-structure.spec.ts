import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// On Windows, paths ignore case, so `./Snackbar` resolves to a file `snackbar.tsx` sitting beside a folder `Snackbar/`
// and the import silently gets the wrong module. Linux CI resolves it the other way, so only this test catches it.
const findCaseClashes = (root: string): string[] => {
  const clashes: string[] = [];

  const walk = (dir: string): void => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const folders = entries.filter((entry) => entry.isDirectory());
    const files = entries.filter((entry) => entry.isFile());

    for (const file of files) {
      const stem = file.name.slice(0, file.name.indexOf('.') === -1 ? undefined : file.name.indexOf('.'));
      const clash = folders.find((folder) => folder.name !== stem && folder.name.toLowerCase() === stem.toLowerCase());

      if (clash) {
        clashes.push(
          `${path.relative(root, path.join(dir, file.name))} <-> ${path.relative(root, path.join(dir, clash.name))}/`
        );
      }
    }

    folders.forEach((folder) => walk(path.join(dir, folder.name)));
  };

  walk(root);

  return clashes;
};

describe('project structure', () => {
  test('should have no file beside a folder whose name differs only by case', () => {
    expect(findCaseClashes(path.resolve(import.meta.dirname, '../../src'))).toEqual([]);
  });

  test('should detect a file beside a folder whose name differs only by case', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-x-case-clash-'));

    try {
      fs.mkdirSync(path.join(root, 'snackbar', 'Snackbar'), { recursive: true });
      fs.writeFileSync(path.join(root, 'snackbar', 'snackbar.tsx'), '');
      fs.writeFileSync(path.join(root, 'snackbar', 'add-snackbar.tsx'), '');

      expect(findCaseClashes(root)).toEqual([
        `${path.join('snackbar', 'snackbar.tsx')} <-> ${path.join('snackbar', 'Snackbar')}/`
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
