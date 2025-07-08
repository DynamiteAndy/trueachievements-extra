const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const traverseToParent = (
  obj: Record<string, unknown>,
  keys: string[],
  createMissing: boolean
): Record<string, unknown> | undefined => {
  let current = obj;

  for (const key of keys) {
    if (BLOCKED_KEYS.has(key)) return undefined;

    const next = current[key];

    if (isPlainObject(next)) {
      current = next;
    } else if (createMissing) {
      const created: Record<string, unknown> = {};
      current[key] = created;
      current = created;
    } else {
      return undefined;
    }
  }

  return current;
};

export const getValue = <T>(obj: Record<string, unknown>, path: string, defaultValue: T): T => {
  const keys = path.split('.');
  const last = keys.pop();
  if (!last || BLOCKED_KEYS.has(last)) return defaultValue;

  const parent = traverseToParent(obj, keys, false);
  if (!parent || !(last in parent)) return defaultValue;

  return parent[last] as T;
};

export const setValue = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.');
  const last = keys.pop();
  if (!last || BLOCKED_KEYS.has(last)) return;

  const parent = traverseToParent(obj, keys, true);
  if (!parent) return;

  parent[last] = value;
};