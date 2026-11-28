// Tampermonkey values live in localStorage, which is cleared before every test (test/mocks/settings.ts)
const valueListeners = new Map<number, { key: string; listener: Tampermonkey.ValueChangeListener }>();
let nextListenerId = 1;

// As Tampermonkey does: a value is stored as a copy (an object read back or handed to a listener is never the one
// written), and `undefined` is stored as a value, kept in the list and read back as undefined rather than the default.
// localStorage holds JSON, with this text standing for undefined (which JSON can't hold)
const storedUndefined = 'undefined';
const encode = (value: unknown): string => (value === undefined ? storedUndefined : JSON.stringify(value));
const decode = (stored: string): unknown => (stored === storedUndefined ? undefined : JSON.parse(stored));

vi.stubGlobal('GM_getValue', (key: string, defaultValue?: unknown) => {
  const value = localStorage.getItem(key);
  return value === null ? defaultValue : decode(value);
});

// Tampermonkey tells this tab's listeners about its own writes and deletes too, with `remote` false (a delete's new
// value is undefined). Nothing reads `remote`, so the mock always passes false, even for a write a spec makes as
// another tab would
const notify = (key: string, oldValue: string | null, newValue: string | undefined): void => {
  [...valueListeners.values()]
    .filter((entry) => entry.key === key)
    .forEach(({ listener }) =>
      listener(
        key,
        (oldValue === null ? undefined : decode(oldValue)) as Tampermonkey.StorageValue,
        (newValue === undefined ? undefined : decode(newValue)) as Tampermonkey.StorageValue,
        false
      )
    );
};

vi.stubGlobal('GM_setValue', (key: string, value: unknown) => {
  const oldValue = localStorage.getItem(key);
  localStorage.setItem(key, encode(value));
  notify(key, oldValue, encode(value));
});
vi.stubGlobal('GM_deleteValue', (key: string) => {
  const oldValue = localStorage.getItem(key);
  localStorage.removeItem(key);
  if (oldValue !== null) {
    notify(key, oldValue, undefined);
  }
});
// Read by index: Object.keys misses a key named like one of Storage's own members (key, length…)
vi.stubGlobal('GM_listValues', () =>
  Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter((key) => key !== null)
);
vi.stubGlobal('GM_addValueChangeListener', (key: string, listener: Tampermonkey.ValueChangeListener) => {
  const id = nextListenerId++;
  valueListeners.set(id, { key, listener });
  return id;
});
vi.stubGlobal('GM_removeValueChangeListener', (id: number) => valueListeners.delete(id));
vi.stubGlobal(
  'GM_openInTab',
  vi.fn(() => ({ close: vi.fn(), closed: false, onclose: null }))
);
// A release script's name; claim-page.spec.ts swaps in others
vi.stubGlobal('GM_info', { script: { name: 'TrueAchievements Extra' } });

afterEach(() => {
  valueListeners.clear();
});
