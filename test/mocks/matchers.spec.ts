describe('test/mocks/matchers', () => {
  const element = (classes: string): HTMLElement => {
    const div = document.createElement('div');
    div.className = classes;
    return div;
  };

  test('toHaveExactClasses should pass on exactly the classes, in any order', () => {
    expect(element('b a')).toHaveExactClasses(['a', 'b']);
  });

  test('toHaveExactClasses should fail on a class missing, one too many, or not an element', () => {
    expect(() => expect(element('a')).toHaveExactClasses(['a', 'b'])).toThrow('to have exactly the classes a b');
    expect(() => expect(element('a b c')).toHaveExactClasses(['a', 'b'])).toThrow('to have exactly the classes a b');
    expect(() => expect(null).toHaveExactClasses(['a'])).toThrow('expected an element, got null');
    expect(element('a b')).not.toHaveExactClasses(['a']);
  });

  test('toHaveExactClasses should fail on a class listed twice, with or without .not', () => {
    expect(() => expect(element('a b')).toHaveExactClasses(['a', 'a', 'b'])).toThrow(
      'toHaveExactClasses lists a more than once'
    );
    expect(() => expect(element('a')).not.toHaveExactClasses(['b', 'b'])).toThrow(
      'toHaveExactClasses lists b more than once'
    );
  });

  test('toBeLastChildOf should pass only on the last element child', () => {
    const parent = document.createElement('ul');
    const first = parent.appendChild(document.createElement('li'));
    const last = parent.appendChild(document.createElement('li'));
    parent.append('trailing text');

    expect(last).toBeLastChildOf(parent);
    expect(() => expect(first).toBeLastChildOf(parent)).toThrow('to be the last child of <ul');
  });

  test('toEqual and the call matchers should tell a look-alike element from the same one', () => {
    const one = element('a');
    const lookAlike = element('a');
    const called = vi.fn();
    called(one);

    expect(one.isEqualNode(lookAlike)).toBe(true);
    expect([one]).toEqual([one]);
    expect([one]).not.toEqual([lookAlike]);
    expect({ target: one }).not.toEqual({ target: lookAlike });
    expect(called).toHaveBeenCalledWith(one);
    expect(called).not.toHaveBeenCalledWith(lookAlike);
  });
});
