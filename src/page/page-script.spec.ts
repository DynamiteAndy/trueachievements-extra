import vm from 'node:vm';

import { addPageScript, pageGlobal, pageScript } from './page-script';

describe('page/page-script', () => {
  test('should call the function with JSON values, page globals by name and other functions by their source', () => {
    const add = (a: number, b: number): number => a + b;
    const fn = (value: string, list: number[], editor: { name: string }, helper: (a: number, b: number) => number) =>
      `${value}:${list.join('')}:${editor.name}:${helper(list[0], list[1])}`;

    const source = pageScript(fn, 'it\'s "quoted"', [1, 2], pageGlobal('tinymce.activeEditor'), add);

    // Run as the page would, where only the page's globals exist
    expect(vm.runInNewContext(source, { tinymce: { activeEditor: { name: 'editor' } } })).toBe(
      'it\'s "quoted":12:editor:3'
    );
  });

  test('should pass null and objects as JSON', () => {
    const fn = (options: { a: { b: string } }, nothing: null) => `${options.a.b}:${nothing}`;

    expect(vm.runInNewContext(pageScript(fn, { a: { b: 'deep' } }, null))).toBe('deep:null');
  });

  test("should add the script to the page's head", () => {
    const fn = (columns: string[]): string => columns.join('');

    const script = addPageScript('ta-x-test', fn, [['a', 'b']]);
    onTestFinished(() => script.remove());

    expect(script.parentNode).toBe(document.head);
    expect(script.id).toBe('ta-x-test');
    expect(script.textContent).toBe(pageScript(fn, ['a', 'b']));
  });

  test('should add the script to the page itself when it has no head yet', () => {
    const head = document.head;
    head.remove();
    onTestFinished(() => document.documentElement.prepend(head));

    const script = addPageScript('ta-x-test', (): void => undefined);
    onTestFinished(() => script.remove());

    expect(script.parentNode).toBe(document.documentElement);
  });

  test('should fail a function that reaches outside itself, as it would in the page', () => {
    const outside = 'from our module';
    const fn = (): string => outside;

    // (the error is the context's own ReferenceError, so it's matched by message)
    expect(() => vm.runInNewContext(pageScript(fn))).toThrow(/outside is not defined/);
  });
});
