// Loose expectations that keep coming back, which the lint rules can't see: an optional chain or a `?? []`, `?? ''`,
// `?? 0` or `?? false` fallback inside expect() under a matcher that also passes when the thing is missing (so a lookup
// that found nothing passes), and `.not.toBeNull()`, `.toBeTruthy()` or `.toBeDefined()` on find() or required(), which
// throw before it's reached. Whole files are scanned, so an expect() wrapped over several lines is caught too, in specs
// and their spec helpers
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');

const specFiles = (dir: string): string[] =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const relative = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      return entry.name === 'html' || entry.name === 'node_modules' ? [] : specFiles(relative);
    }
    return /\.spec(-helpers)?\.tsx?$/.test(entry.name) && entry.name !== 'spec-style.spec.ts' ? [relative] : [];
  });

// `[^;]*` runs across lines, up to the end of the statement
const looseChecks: { name: string; pattern: RegExp; examples: string[] }[] = [
  {
    name: 'an optional chain or an empty fallback in expect() under a matcher that passes when it is missing',
    pattern:
      /expect\([^;]*(\?\.|\?\? *(\[\]|''|0|false))[^;]*\)\.(not\.|toBeFalsy|toBeUndefined|toEqual\(\[\]\)|toStrictEqual\(\[\]\)|toHaveLength\(0\)|toBe\(false\)|toBe\(''\))/g,
    examples: [
      "expect(row?.querySelector('p')).not.toBeNull();",
      'expect([...(list?.children ?? [])]).toEqual([]);',
      "expect(\n  row?.querySelector('p')\n).toBeUndefined();",
      'expect(list?.items).toStrictEqual([]);',
      "expect(header.textContent ?? '').toBe('');",
      'expect(row.dataset.count ?? 0).not.toBe(1);',
      'expect(input.checked ?? false).toBe(false);'
    ]
  },
  {
    name: '`.not.toBeNull()`, `.toBeTruthy()` or `.toBeDefined()` on find() or required(), which throw first',
    pattern: /expect\(\s*(find|required)(<[^>]*>)?\([^;]*\)\s*\)\.(not\.toBeNull|toBeTruthy|toBeDefined)/g,
    examples: [
      "expect(find('p', row)).not.toBeNull();",
      "expect(find<HTMLInputElement>('input')).not.toBeNull();",
      'expect(\n  required(document.querySelector(".x"))\n).not.toBeNull();',
      "expect(find('#ta-x-giveaway-opt-in')).toBeTruthy();",
      'expect(required(row.querySelector("a"))).toBeDefined();'
    ]
  }
];

const lineOf = (text: string, index: number): number => text.slice(0, index).split('\n').length;

describe('spec style', () => {
  test.each(looseChecks)('should catch each example of $name', ({ pattern, examples }) => {
    expect(examples.filter((example) => [...example.matchAll(pattern)].length === 0)).toEqual([]);
  });

  test.each(looseChecks)('should find no spec with $name', ({ pattern }) => {
    const found = [...specFiles('src'), ...specFiles('test')].flatMap((file) => {
      const text = fs.readFileSync(path.join(root, file), 'utf8');
      return [...text.matchAll(pattern)].map((match) => `${file}:${lineOf(text, match.index)}`);
    });

    expect(found).toEqual([]);
  });
});
