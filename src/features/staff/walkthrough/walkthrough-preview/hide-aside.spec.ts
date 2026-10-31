import { find, neverFinds, required, setHtml } from '@ta-x-test';

import { hideAside } from './hide-aside';

describe('staff/walkthrough/walkthrough-preview/hide-aside', () => {
  const main = (): HTMLElement => find('.page main');

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-walkthrough-preview/in-progress-whole-page.html');
  });

  // Each missing element is a timed-out wait
  const without = (missing: string): void => {
    document.querySelector(missing)?.remove();
    neverFinds(missing);
  };

  test('should widen the content and remove the aside', async () => {
    await hideAside();

    expect(main().classList).toContain('no-aside');
    expect(required(main().parentElement).classList).toContain('no-aside');
    expect(document.querySelector('.page aside')).toBeNull();
  });

  test('should still remove the aside, without throwing, when there is no main', async () => {
    without('.page main');

    await expect(hideAside()).resolves.toBeUndefined();
    expect(document.querySelector('.page aside')).toBeNull();
    expect(document.querySelectorAll('.no-aside')).toHaveLength(0);
  });

  test('should still widen the content, without throwing, when there is no aside', async () => {
    without('.page aside');

    await expect(hideAside()).resolves.toBeUndefined();
    expect(main().classList).toContain('no-aside');
  });
});
