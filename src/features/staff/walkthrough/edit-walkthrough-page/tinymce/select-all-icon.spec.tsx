import { find, neverFinds, setHtml } from '@ta-x-test';

import { addSelectAllIcon } from './select-all-icon';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/select-all-icon', () => {
  // TinyMCE's Select all button as the site's editor draws it: its icon element, with no glyph
  const icon = (): HTMLElement => find('.mce-i-selectall');

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-select-all.html');
  });

  test('should draw the select-all icon in the button, and leave its neighbours alone', async () => {
    await addSelectAllIcon();

    expect(find('.mce-i-cut').childElementCount).toBe(0);

    // Which icon it draws is SelectAllIcon's own spec
    expect([...icon().children].map((child) => child.tagName.toLowerCase())).toEqual(['svg']);
  });

  test('should not throw if the button never renders', async () => {
    neverFinds('.mce-btn[aria-label="Select all"] .mce-i-selectall');

    await expect(addSelectAllIcon()).resolves.toBeUndefined();
  });
});
