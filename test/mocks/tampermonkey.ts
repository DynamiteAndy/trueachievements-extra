import { localStorage } from './local-storage';

const GM_getValue = vi.fn();
const GM_setValue = vi.fn();
const GM_deleteValue = vi.fn();
const GM_xmlhttpRequest = vi.fn();

GM_getValue.mockImplementation((key: string, defaultValue?: '') =>
  localStorage.has(key) ? localStorage.get(key) : defaultValue
);
GM_setValue.mockImplementation((key: string, value: unknown) => localStorage.set(key, value));
GM_deleteValue.mockImplementation(() => localStorage.clear());

global.GM_getValue = GM_getValue;
global.GM_setValue = GM_setValue;
global.GM_deleteValue = GM_deleteValue;
global.GM_xmlhttpRequest = GM_xmlhttpRequest;
(global.GM_info as unknown) = { script: {} };
