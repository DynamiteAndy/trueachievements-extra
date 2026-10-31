import { find, mountForTest, setHtml } from '@ta-x-test';

import styles from '../styles';

import { HoverableParagraphs } from './HoverableParagraphs';

describe('HoverableParagraphs', () => {
  const page = (): HTMLElement => find('#divWalkthroughPagePreview .walkthroughpage');

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-walkthrough/gears-of-war-4-page-1.html');
  });

  test("should mark the walkthrough page's text while mounted", () => {
    mountForTest(<HoverableParagraphs page={page()} />, document.createElement('div'));

    expect(page().classList).toContain(styles.hoverableParagraphs);
  });

  test('should give the page back as it was when unmounted', () => {
    const served = page().outerHTML;

    mountForTest(<HoverableParagraphs page={page()} />, document.createElement('div')).unmount();

    expect(page().outerHTML).toBe(served);
  });
});
