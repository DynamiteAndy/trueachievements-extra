import { elementOf, find, mountForTest, setHtml } from '@ta-x-test';

import styles from '../styles';

import { ImageTitle } from './ImageTitle';

describe('ImageTitle', () => {
  const anchor = (): Element => find('#iv132809 a');

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/image-viewer.html');
  });

  test('should render the title in a paragraph with its style class', () => {
    const root = mountForTest(<ImageTitle title="Granum Mountain - Missing Chest" />, anchor());

    expect(elementOf(root).tagName).toBe('P');
    expect(elementOf(root)).toHaveExactClasses([styles.improvedImageSelectorImageTitle]);
    expect(elementOf(root).textContent).toBe('Granum Mountain - Missing Chest');
  });

  test('should render the title as text, not markup', () => {
    const root = mountForTest(<ImageTitle title="<b>Credits</b>" />, anchor());

    expect(elementOf(root).textContent).toBe('<b>Credits</b>');
    expect(elementOf(root).children).toHaveLength(0);
  });
});
