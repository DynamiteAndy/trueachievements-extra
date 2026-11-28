import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The command line around condense() (condense.spec.ts has the condensing): run as pnpm runs it, on files of its own
describe('test/tools/fixtures/condense-cli', () => {
  const run = (...flags: string[]): string => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-x-condense-cli-'));
    onTestFinished(() => fs.rmSync(folder, { recursive: true, force: true }));
    const [input, output] = [path.join(folder, 'in.html'), path.join(folder, 'out.html')];
    fs.writeFileSync(input, '<p>Hi</p>');

    execFileSync(process.execPath, [path.join(import.meta.dirname, 'condense-cli.ts'), input, output, ...flags]);

    return fs.readFileSync(output, 'utf8');
  };

  // pnpm hands on a note typed across lines with a literal \n where each line break was
  test("should turn a note's literal \\n into line breaks, as typed across lines", () => {
    const out = run('--page', 'https://example.test', '--date', '2026-11-24', '--note', 'line one\\nline two');

    expect(out.split('\n').slice(0, 5)).toEqual([
      '<!--',
      '  https://example.test, captured 2026-11-24.',
      '  line one',
      '  line two',
      '-->'
    ]);
  });
});
