import { find, readFixtureDocument, renderElement } from '@ta-x-test';

import { WalkthroughThanks } from './WalkthroughThanks';

describe('ui/walkthrough-thanks/WalkthroughThanks', () => {
  test("renders the site's thanks block", () => {
    const thanks = renderElement(<WalkthroughThanks count="135" src="/images/walkthroughs/thumbs_up.png" />);

    // As Mirror's Edge's walkthrough page renders it, without the count's nv class: it does nothing on forum pages
    // and hides the count on walkthrough previews
    const site = find('.thanks', readFixtureDocument('@ta-x-test-views/game-walkthrough/mirrors-edge.html'));
    find('span', site).removeAttribute('class');
    expect(thanks.outerHTML).toBe(site.outerHTML);
  });

  test("uses the site's own thumbs up when given none", () => {
    const thanks = renderElement(<WalkthroughThanks count="0" />);

    expect(find('img', thanks).getAttribute('src')).toBe('/images/walkthroughs/thumbs_up.png');
  });
});
