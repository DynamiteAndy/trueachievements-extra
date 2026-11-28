import * as taxPage from '@ta-x-page';
import { find, readFixtureDocument } from '@ta-x-test';

import styles from '../styles';

import { findOrAddButtonGroup } from './button-group';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/button-group findOrAddButtonGroup', () => {
  const scripts = (): string[] =>
    [...document.querySelectorAll('script[id^="ta-x-tinymce-button-group"]')].map((script) => script.id);
  // Our group as TinyMCE draws it
  const ourGroup = (): HTMLElement =>
    find(
      `.mce-${styles.tinymceGroup}`,
      readFixtureDocument('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-our-group.html')
    );

  test('should hand back our group once it turns up, adding nothing', async () => {
    const group = ourGroup();
    document.body.append(group);

    expect(await findOrAddButtonGroup()).toBe(group);
    expect(scripts()).toEqual([]);
  });

  test("should add it again when it doesn't turn up, and hand it back once it has", async () => {
    const group = ourGroup();
    const wait = vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null).mockResolvedValueOnce(group);

    expect(await findOrAddButtonGroup()).toBe(group);
    expect(scripts()).toEqual(['ta-x-tinymce-button-group-again']);
    expect(wait.mock.calls.map(([selector]) => selector)).toEqual([
      `.mce-${styles.tinymceGroup}`,
      `.mce-${styles.tinymceGroup}`
    ]);
  });
});
