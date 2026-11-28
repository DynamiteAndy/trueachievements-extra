// The mock tells value-change listeners what Tampermonkey's own GM_* functions do, checked in Tampermonkey with a
// listener on a key that was set and then deleted
describe('test/mocks/tampermonkey', () => {
  test("should tell a key's listeners about this tab's set and delete, the delete's new value undefined", () => {
    const seen: unknown[][] = [];
    GM_addValueChangeListener('mock-key', (...args) => {
      seen.push(args);
    });

    GM_setValue('mock-key', 'set');
    GM_deleteValue('mock-key');

    expect(seen).toEqual([
      ['mock-key', undefined, 'set', false],
      ['mock-key', 'set', undefined, false]
    ]);
  });

  test('should tell no listener about deleting a key that has no value', () => {
    const listener = vi.fn();
    GM_addValueChangeListener('mock-key', listener);

    GM_deleteValue('mock-key');

    expect(listener).not.toHaveBeenCalled();
  });

  // As Tampermonkey does (checked live): an undefined stays in the list and reads back undefined, not the default
  test('should keep a value set to undefined, read back as undefined rather than the default', () => {
    GM_setValue('key', 'before');
    GM_setValue('key', undefined);

    expect(GM_getValue('key', 'fallback')).toBeUndefined();
    expect(GM_listValues()).toContain('key');
  });

  // Checked live: neither a listener nor a later read gets the object that was written
  test('should hand listeners and later reads a copy of what was written', () => {
    const written = { a: 1 };
    const heard: unknown[] = [];
    GM_addValueChangeListener('key', (_key, _old, value) => heard.push(value));

    GM_setValue('key', written);

    expect(heard).toEqual([{ a: 1 }]);
    expect(heard[0]).not.toBe(written);
    expect(GM_getValue('key')).toEqual({ a: 1 });
    expect(GM_getValue('key')).not.toBe(written);
  });

  // A key named like a member of Storage itself isn't an own property of localStorage, so it's listed by index
  test('should list every stored key, one named like a member of Storage too', () => {
    GM_setValue('length', 1);
    GM_setValue('plain', 2);

    expect(GM_listValues()).toEqual(expect.arrayContaining(['length', 'plain']));
  });
});
