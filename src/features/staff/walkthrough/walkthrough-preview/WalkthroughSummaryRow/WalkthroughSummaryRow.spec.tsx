import { find, renderElement } from '@ta-x-test';

import { WalkthroughSummaryRow } from './WalkthroughSummaryRow';

describe('WalkthroughSummaryRow', () => {
  test('should render a page index row linking back to the walkthrough preview, named like the site', () => {
    const row = renderElement(<WalkthroughSummaryRow walkthroughId="4138" walkthroughName="#BLUD" />);

    expect(row.tagName).toBe('TR');
    expect(find('td', row).textContent).toBe('');
    expect(find('a', row).getAttribute('href')).toBe('/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=4138');
    expect(find('a', row).textContent).toBe('#BLUD Walkthrough');
  });
});
