import { renderElement, required } from '@ta-x-test';

import { WalkthroughPagesSection } from './WalkthroughPagesSection';

describe('staff/walkthrough/walkthrough-preview/WalkthroughPagesSection', () => {
  const pages = [
    { index: '1', title: 'Walkthrough overview', id: '26658' },
    { index: '2', title: 'Intro', id: '26660' }
  ];

  test("renders the site's page index with its classes: the walkthrough, then each page", () => {
    const section = renderElement(
      <WalkthroughPagesSection walkthroughId="4138" walkthroughName="#BLUD" pages={pages} currentPageId="26660" />
    );

    expect([...section.classList]).toEqual(['purple', 'page-index']);
    expect(required(section.firstElementChild).textContent).toBe('Pages In This Walkthrough');
    const rows = [...section.querySelectorAll('table.wt-pl tbody tr')];
    expect(rows.map((row) => row.textContent.trim())).toEqual(['#BLUD Walkthrough', '1Walkthrough overview', '2Intro']);
    expect(rows[2].querySelector('a')).toBeNull();
  });
});
