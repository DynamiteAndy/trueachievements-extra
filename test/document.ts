import fs from 'node:fs';
import { getPath } from '@ta-x-build-helpers';

export const setHtml = async (path: string, opts?: { url?: string }): Promise<void> => {
  document.body.innerHTML = fs.readFileSync(getPath(path), 'utf8');

  if (opts?.url) {
    window.location.href = opts.url;
  }
};

export const setLocalStorage = (value: Map<string, unknown>): void => {
  value.forEach((val, key) => {
    localStorage.setItem(key, JSON.stringify(val));
  });
};

beforeEach(() => {
  localStorage.clear();
});
