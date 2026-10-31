import { setHtml, tick, withoutBody } from '@ta-x-test';

import styles from './styles';

import hideAdRows from '.';

describe('news/sales/hide-ad-rows', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/empty.html');
  });

  // The site's own check before it hides its ads: TA Pro's subscription details include a key starting `1_0`
  test('should mark the page as ad free for TA Pro', async () => {
    localStorage.setItem('lh_sub', '{"key":"1_0_0"}');

    await hideAdRows();

    expect(document.body.classList).toContain(styles.salesAdFree);
  });

  // It starts at document-start, beside the other sales features
  test('should wait for the page to have a body before marking it', async () => {
    localStorage.setItem('lh_sub', '{"key":"1_0_0"}');
    const addBody = withoutBody();

    const marking = hideAdRows();
    await tick();
    const body = addBody();
    await marking;

    expect(body.classList).toContain(styles.salesAdFree);
  });

  test.each([
    ['no subscription details', null],
    ['a subscription without ad free', '{"key":"0_0_0"}']
  ])('should leave the ad rows with %s', async (_, value) => {
    if (value) {
      localStorage.setItem('lh_sub', value);
    }

    await hideAdRows();

    expect(document.body.classList).not.toContain(styles.salesAdFree);
  });
});
