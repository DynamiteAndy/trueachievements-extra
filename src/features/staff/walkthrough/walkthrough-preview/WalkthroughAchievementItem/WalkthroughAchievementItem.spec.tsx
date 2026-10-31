import { find, renderElement } from '@ta-x-test';

import { WalkthroughAchievementItem } from './WalkthroughAchievementItem';

describe('WalkthroughAchievementItem', () => {
  const achievement = {
    title: 'Duck Face',
    description: "Like you *wouldn't* take selfies with all of the animals.",
    page: { index: '5', title: 'Camp Kristofferson', id: '26665' },
    href: '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26665#ap434666',
    id: '434666',
    src: 'https://www.trueachievements.com/imagestore/m/0004101700/4101796.jpg'
  };

  test('should show an achievement whose page is unknown without a link', () => {
    const item = renderElement(
      <WalkthroughAchievementItem achievement={{ ...achievement, page: undefined, href: null }} />
    );

    expect(find('a', item).hasAttribute('href')).toBe(false);
    expect(find('a', item).textContent).toBe('Duck Face');
  });

  test("should render the site's walkthrough achievement item, linking to the achievement on its page", () => {
    const item = renderElement(<WalkthroughAchievementItem achievement={achievement} />);

    expect(item.tagName).toBe('LI');
    expect(item.getAttribute('data-i')).toBe('434666');
    expect(find('img.smallicon', item).getAttribute('alt')).toBe('Duck Face');
    expect(find('a', item).getAttribute('href')).toBe(
      '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26665#ap434666'
    );
    expect(find('a', item).textContent).toBe('Duck Face');
    expect(find('p', item).textContent).toBe(achievement.description);
  });

  test("should draw the icon from the achievements page's sprite, scaled to 32px", () => {
    const item = renderElement(
      <WalkthroughAchievementItem
        achievement={{ ...achievement, icon: { sprite: 'https://www.trueachievements.com/smaps/1.jpg', index: 19 } }}
      />
    );
    const image = find<HTMLImageElement>('img.smallicon', item);

    expect(image.getAttribute('src')).toMatch(/^data:image\/gif;base64,/);
    expect(image.getAttribute('width')).toBe('32');
    expect(image.style.backgroundImage).toBe('url("https://www.trueachievements.com/smaps/1.jpg")');
    expect(image.style.backgroundSize).toBe('32px auto');
    expect(image.style.backgroundPosition).toBe('0px -608px');
  });
});
