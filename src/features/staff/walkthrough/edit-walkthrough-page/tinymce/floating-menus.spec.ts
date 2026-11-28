import { required, setHtml } from '@ta-x-test';

import styles from '../../styles';
import css from '../edit-walkthrough-page.scss';

// The edit walkthrough's stylesheet moves TinyMCE's floating menus to just under the sticky toolbar. Its selector is
// read from the compiled stylesheet and matched against TinyMCE's menus as it adds them to <body>
describe('staff/walkthrough/edit-walkthrough-page/tinymce/floating-menus', () => {
  // The rule that sets a menu's top to the toolbar's line
  const toolbarLineSelector = (): string => {
    const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, , body]) =>
      body.includes('--ta-x-sticky-toolbar-floating-menu')
    );
    return required(rule)[1].trim();
  };

  const menu = (text: string): HTMLElement =>
    required(
      [...document.querySelectorAll<HTMLElement>('body > .mce-menu')].find((element) =>
        element.textContent.includes(text)
      )
    );

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-floating-menus.html');
    // The classes our script puts on <body>
    document.body.classList.add('trueachievement-extras', styles.staff);
  });

  test("should move the toolbar's menus under the toolbar", () => {
    expect(menu('Paragraph').matches(toolbarLineSelector())).toBe(true);
  });

  test("should leave a dialog's dropdown under its field", () => {
    // Moved to the toolbar's line, Table properties' Alignment would open far below its field
    expect(menu('Left').matches(toolbarLineSelector())).toBe(false);
  });

  test('should leave a submenu beside the item it opens from', () => {
    menu('Paragraph').classList.add('mce-menu-sub');

    expect(menu('Paragraph').matches(toolbarLineSelector())).toBe(false);
  });
});
