import { parseStoredJson } from './stored-json';

// One value a feature keeps in Tampermonkey storage under its key, as JSON: setting() is for settings (signals the
// settings menu changes), this for a feature's own data. Declare each key in stored-values.spec.ts, and change its
// format with a migration (migrations.ts), so reading it needn't cope with an old one.
interface Stored<T> {
  readonly key: string;
  // The stored value, or the default when the key isn't stored (or can't be read)
  get: () => T;
  set: (value: T) => void;
  delete: () => void;
}

export const stored = <T>(key: string, defaultValue: T): Stored<T> => ({
  key,
  get: () => {
    const value = parseStoredJson(key, GM_getValue(key, ''));

    return value === undefined ? defaultValue : (value as T);
  },
  set: (value) => GM_setValue(key, JSON.stringify(value)),
  delete: () => GM_deleteValue(key)
});
