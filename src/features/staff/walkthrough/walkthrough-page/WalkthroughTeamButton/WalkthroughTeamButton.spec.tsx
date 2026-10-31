import { elementOf, find, mountForTest, setHtml } from '@ta-x-test';

import { WalkthroughTeamButton } from './WalkthroughTeamButton';

describe('WalkthroughTeamButton', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/no-page-selected.html');
  });

  test('should render a site button, posting back from its href rather than an onclick', () => {
    const root = mountForTest(<WalkthroughTeamButton />, find('#chWalkthroughPageVersions .content .buttons'));
    const button = elementOf(root);

    expect([button.tagName, button.id, button.className]).toEqual(['A', 'btnBackToWalkthrough', 'button']);
    expect(button.getAttribute('href')).toBe("javascript:Postback('btnBackToWalkthrough_click')");
    expect(button.hasAttribute('onclick')).toBe(false);
    expect([find('img', button).getAttribute('src'), find('img', button).getAttribute('width')]).toEqual([
      '/images/icons/leftarrow.png',
      '16'
    ]);
    expect(button.textContent.trim()).toBe('Back to management');
    // The site's own button has its tooltip on the link too, not only on its icon
    expect(button.getAttribute('title')).toBe('Back to management');
  });
});
