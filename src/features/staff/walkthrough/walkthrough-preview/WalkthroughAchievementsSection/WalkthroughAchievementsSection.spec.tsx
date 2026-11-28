import { renderElement, required } from '@ta-x-test';

import { WalkthroughAchievementsSection } from './WalkthroughAchievementsSection';

describe('staff/walkthrough/walkthrough-preview/WalkthroughAchievementsSection', () => {
  test("renders the site's walkthrough achievements section with its classes and an item per achievement", () => {
    const achievement = {
      title: 'Duck Face',
      description: "Like you *wouldn't* take selfies with all of the animals.",
      page: { index: '5', title: 'Camp Kristofferson', id: '26665' },
      href: '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26665#ap434666',
      id: '434666',
      src: 'https://www.trueachievements.com/imagestore/m/0004101700/4101796.jpg'
    };

    const section = renderElement(<WalkthroughAchievementsSection achievements={[achievement]} />);

    expect([...section.classList]).toEqual(['green', 'walkthrough-right']);
    expect(required(section.firstElementChild).textContent).toBe('Walkthrough Achievements');
    expect([...section.querySelectorAll('ul.il > li')].map((item) => item.getAttribute('data-i'))).toEqual(['434666']);
  });
});
