import { elementOf, find, mountForTest, required, setHtml } from '@ta-x-test';

import { ReadyForReviewButton } from './ReadyForReviewButton';

describe('ReadyForReviewButton', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/page-selected.html');
  });

  test('should render a site button, posting back from its href rather than an onclick', () => {
    const root = mountForTest(<ReadyForReviewButton />, required(find('#btnCancel').parentElement));
    const button = elementOf(root);

    expect([button.tagName, button.id, button.className]).toEqual(['A', 'btnReadyForReview', 'button']);
    expect(button.getAttribute('href')).toBe("javascript:Postback('btnReadyForReview_click')");
    expect(button.hasAttribute('onclick')).toBe(false);
    expect([find('img', button).getAttribute('src'), find('img', button).getAttribute('width')]).toEqual([
      '/images/icons/eye.png',
      '16'
    ]);
    expect(button.textContent.trim()).toBe('Ready for review');
  });
});
