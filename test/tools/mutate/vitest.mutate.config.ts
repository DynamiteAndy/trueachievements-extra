// The Vitest config the mutation check runs with (prove.ts): the project's own, plus a transform that changes source or
// spec lines in memory only, from MUTATE (a JSON array of mutations). Nothing in the repo is written. A mutation that
// doesn't apply fails the run loudly, so a typo can't pass as "no test caught it".
import { fileURLToPath } from 'node:url';

import base from '../../../vitest.config.mts';

export type Mutation = {
  // The file it applies to, from the repo root (matched on the end of the path)
  file: string;
  from: string;
  to: string;
  // Which match, when `from` appears more than once (0-based)
  nth?: number;
  // Only on this line (1-based)
  line?: number;
};

const root = fileURLToPath(new URL('../../..', import.meta.url));
const mutations: Mutation[] = process.env.MUTATE ? (JSON.parse(process.env.MUTATE) as Mutation[]) : [];
const normalise = (path: string): string => path.replaceAll('\\', '/').toLowerCase();

// Replaces one match by position, so `to` is taken as written (no `$&` patterns) and `nth` past the last match fails
const replaceNth = (text: string, mutation: Mutation, where: string): string => {
  const count = text.split(mutation.from).length - 1;
  if (count === 0) {
    throw new Error(`MUTATION NOT APPLIED: "${mutation.from}" not found ${where}`);
  }
  if (count > 1 && mutation.nth === undefined) {
    throw new Error(`MUTATION AMBIGUOUS: ${count} matches of "${mutation.from}" ${where}`);
  }
  const nth = mutation.nth ?? 0;
  if (nth >= count) {
    throw new Error(`MUTATION NOT APPLIED: nth ${nth} of "${mutation.from}", which has ${count} matches ${where}`);
  }
  let at = -1;
  for (let match = 0; match <= nth; match++) {
    at = text.indexOf(mutation.from, at + 1);
  }
  return text.slice(0, at) + mutation.to + text.slice(at + mutation.from.length);
};

const applyOne = (code: string, mutation: Mutation, id: string): string => {
  if (mutation.line === undefined) {
    return replaceNth(code, mutation, `in ${id}`);
  }
  const lines = code.split('\n');
  const line = lines[mutation.line - 1];
  if (line === undefined) {
    throw new Error(`MUTATION NOT APPLIED: no line ${mutation.line} in ${id}`);
  }
  lines[mutation.line - 1] = replaceNth(line, mutation, `on line ${mutation.line} of ${id}: ${line}`);
  return lines.join('\n');
};

const mutate = {
  name: 'ta-x-mutate',
  enforce: 'pre' as const,
  transform(code: string, id: string): { code: string; map: null } | null {
    const file = normalise(id.split('?')[0]);
    // Each keeps its index in MUTATE, logged once applied, so prove.ts can name one that never applied
    const mine = mutations
      .map((mutation, index) => ({ ...mutation, index }))
      .filter((mutation) => file.endsWith(normalise(mutation.file)));
    if (mine.length === 0) {
      return null;
    }
    // Line mutations bottom up, so one changing a line's length can't move another's line
    let out = code;
    for (const mutation of mine
      .filter((each) => each.line !== undefined)
      .sort((a, b) => (b.line ?? 0) - (a.line ?? 0))) {
      out = applyOne(out, mutation, id);
    }
    for (const mutation of mine.filter((each) => each.line === undefined)) {
      out = applyOne(out, mutation, id);
    }
    for (const { index } of mine) {
      console.log(`MUTATION APPLIED #${index} to ${id}`);
    }
    return { code: out, map: null };
  }
};

export default {
  ...base,
  root,
  plugins: [mutate, ...(base.plugins ?? [])],
  test: {
    ...base.test,
    root,
    includeTaskLocation: true,
    // Vitest's module cache would hand back the unmutated module
    fsModuleCache: false
  }
};
