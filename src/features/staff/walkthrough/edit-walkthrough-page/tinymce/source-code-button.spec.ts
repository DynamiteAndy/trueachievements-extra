import { find, setHtml } from '@ta-x-test';

import styles from '../styles';

import { addSourceCodeButton } from './source-code-button';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/source-code-button', () => {
  const button = (): HTMLButtonElement => find(`.${styles.jsSourceCodeButton}`);

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-our-group.html');
    // The fixture was captured with only the style class on the button: the page function (which doesn't run here)
    // marks it with both
    find(`.${styles.sourceCodeButton}`).classList.add(styles.jsSourceCodeButton);
  });

  test('should inject the script that adds the button to the TinyMCE group', async () => {
    await addSourceCodeButton();

    expect(document.querySelector('script#ta-x-code-editor-command')).not.toBeNull();
  });

  test("should replace TinyMCE's placeholder icon with the code icon", async () => {
    await addSourceCodeButton();

    // Which icon it draws is Code's own spec
    expect([...button().children].map((icon) => icon.tagName.toLowerCase())).toEqual(['svg']);
  });
});
