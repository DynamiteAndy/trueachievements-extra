export let localStorage: Map<string, any>;
export const setLocalStorage = (value: Map<string, any>): void => {
  localStorage = value;
}

beforeEach(() => {
  const GM_getValue = jasmine.createSpy();
  const GM_setValue = jasmine.createSpy();
  const GM_deleteValue = jasmine.createSpy();

  GM_getValue.and.callFake((key: string, defaultValue?: "") => localStorage.has(key) ? localStorage.get(key): defaultValue);
  GM_setValue.and.callFake((key: string, value: any) => localStorage.set(key, value));
  GM_deleteValue.and.callFake(() => (localStorage.clear()));

  global.GM_getValue = GM_getValue;
  global.GM_setValue = GM_setValue;
  global.GM_deleteValue = GM_deleteValue;
  localStorage = new Map<string, any>();
});