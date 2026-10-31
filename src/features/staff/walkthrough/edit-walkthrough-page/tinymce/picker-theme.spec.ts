import { required } from '@ta-x-test';

import styles from '../../styles';
import css from '../edit-walkthrough-page.scss';

// The table dialog's colour pickers look like the editor's menus, in the light skin and in the dark one. jscolor draws
// those straight into <body>; the colour buttons' pickers are drawn inside a menu already, and keep no box of their
// own. Each rule's selector is read from the compiled stylesheet and matched against both
describe('staff/walkthrough/edit-walkthrough-page/tinymce/picker-theme', () => {
  // The selector of the rule whose declarations include `declaration`, compared without spaces (the minifier decides
  // those)
  const selectorWith = (declaration: string): string => {
    const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, , body]) =>
      body.replaceAll(' ', '').includes(declaration)
    );
    return required(rule)[1].trim();
  };
  const menuBox = (): string => selectorWith('background:#fff!important');
  const darkMenuBox = (): string => selectorWith('background:#2f3740!important');

  // A jscolor picker's box: its wrap, then its border, as jscolor draws them
  const pickerIn = (parent: HTMLElement): HTMLElement => {
    const wrap = document.createElement('div');
    wrap.className = 'jscolor-wrap';
    const border = document.createElement('div');
    border.className = 'jscolor-border';
    wrap.append(border);
    parent.append(wrap);
    onTestFinished(() => wrap.remove());
    return border;
  };

  const editorTheme = (theme: 'dark' | ''): void => {
    document.body.setAttribute('data-ta-x-theme', theme);
    onTestFinished(() => document.body.removeAttribute('data-ta-x-theme'));
  };

  beforeEach(() => {
    // The classes our script puts on <body>
    document.body.classList.add('trueachievement-extras', styles.staff);
  });

  test("should give a table dialog's picker, drawn in the body, the light menus' box", () => {
    editorTheme('');

    expect(pickerIn(document.body).matches(menuBox())).toBe(true);
    expect(pickerIn(document.body).matches(darkMenuBox())).toBe(false);
  });

  test("should give a table dialog's picker the dark menus' colours in the dark editor", () => {
    editorTheme('dark');

    expect(pickerIn(document.body).matches(menuBox())).toBe(true);
    expect(pickerIn(document.body).matches(darkMenuBox())).toBe(true);
  });

  test("should leave a colour button's picker, drawn in its menu, without either box", () => {
    editorTheme('dark');
    const panel = document.createElement('div');
    panel.className = 'ta-x-text-color-picker';
    document.body.append(panel);
    onTestFinished(() => panel.remove());

    expect(pickerIn(panel).matches(menuBox())).toBe(false);
    expect(pickerIn(panel).matches(darkMenuBox())).toBe(false);
  });
});
