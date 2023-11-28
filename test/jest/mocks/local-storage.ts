export let localStorage = new Map<string, unknown>();

export const setLocalStorage = (value: Map<string, unknown>): void => {
  localStorage = value;
};

beforeEach(() => {
  localStorage = new Map<string, unknown>();
});
