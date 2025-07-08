vi.stubGlobal('GM_getValue', (key: string, defaultValue?: unknown) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
});

vi.stubGlobal('GM_setValue', (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value)));
vi.stubGlobal('GM_deleteValue', () => localStorage.clear());
vi.stubGlobal('GM_xmlhttpRequest', vi.fn());
vi.stubGlobal('GM_info', { script: {} });
