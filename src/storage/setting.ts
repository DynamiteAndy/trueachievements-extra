import { signal, type Signal } from '@preact/signals';
import { callAll } from '@ta-x-lib';

import { parseStoredJson } from './stored-json';

// How a setting is stored: a list is kept as a JSON string
type SettingType = 'boolean' | 'string' | 'list' | 'nullable';

type StoredValue<T extends SettingType> = T extends 'boolean'
  ? boolean
  : T extends 'string'
    ? string
    : T extends 'list'
      ? string[]
      : string | null;

// One setting: a signal holding its value, saved to Tampermonkey storage under its key when set, and following
// changes made in other tabs. Read .value in components (they re-render on change) and .peek() elsewhere.
export type Setting<T = unknown> = Signal<T> & {
  readonly key: string;
  readonly defaultValue: T;
  readonly storedAs: SettingType;
};

const read = (key: string, defaultValue: unknown, type: SettingType): unknown => {
  if (type !== 'list') {
    return GM_getValue(key, defaultValue);
  }

  return decodeList(key, GM_getValue(key, ''), defaultValue);
};

// A stored list, or the default when it isn't stored or isn't a list of strings
const decodeList = (key: string, stored: unknown, defaultValue: unknown): unknown => {
  const list = parseStoredJson(key, stored);

  return Array.isArray(list) && list.every((item) => typeof item === 'string') ? list : defaultValue;
};

const same = (a: unknown, b: unknown): boolean => a === b || JSON.stringify(a) === JSON.stringify(b);

// Each setting's reload: reads the stored value again and listens for other tabs' changes again (the specs clear both
// between tests)
const reloads: (() => void)[] = [];

export const setting = <T extends SettingType>(
  key: string,
  defaultValue: StoredValue<T>,
  type: T
): Setting<StoredValue<T>> => {
  // Named by its key, so a dev build's signal log (src/dev/signals-debug.ts) says which setting changed
  const value = signal(read(key, defaultValue, type), { name: key }) as Signal<StoredValue<T>>;
  let listener: number | undefined;
  // While the value comes from storage (another tab, a reload), it isn't written back
  let fromStorage = true;

  const setFromStorage = (next: unknown): void => {
    if (same(value.peek(), next)) {
      return;
    }

    // Reset even when an effect throws, or every later change would go unsaved
    fromStorage = true;
    try {
      value.value = next as StoredValue<T>;
    } finally {
      fromStorage = false;
    }
  };

  const listen = (): void => {
    if (listener !== undefined) {
      GM_removeValueChangeListener(listener);
    }

    listener = GM_addValueChangeListener(key, (_name, _oldValue, newValue) =>
      setFromStorage(type === 'list' ? decodeList(key, newValue, defaultValue) : (newValue ?? defaultValue))
    );
  };

  value.subscribe((next) => {
    if (!fromStorage) {
      GM_setValue(key, type === 'list' ? JSON.stringify(next) : next);
    }
  });
  fromStorage = false;
  listen();

  const result = Object.assign(value, { key, defaultValue, storedAs: type }) as Setting<StoredValue<T>>;
  reloads.push(() => {
    setFromStorage(read(key, defaultValue, type));
    listen();
  });

  return result;
};

// Every setting reads its stored value again and listens again: after the migrations changed storage, and in the specs
// after storage was cleared (test/mocks/settings.ts, before each test)
export const reloadSettings = (): void => callAll(reloads);

// Saves a new value to a setting: the settings menu's rows are given their setting as a prop, and assigning a prop's
// .value in a component is refused by lint (react immutability)
export const saveSetting = <T>(target: Setting<T>, value: T): void => {
  target.value = value;
};
