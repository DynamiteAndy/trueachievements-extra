import { elementOf, find, mountForTest, setHtml } from '@ta-x-test';

import { ManageWalkthroughAchievementRow } from './ManageWalkthroughAchievementRow';

describe('ManageWalkthroughAchievementRow', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
  });

  test('should render a site table row with a linked achievement and no page', () => {
    const tbody = find('#scrolllstWalkthroughAchievementID tbody');
    const root = mountForTest(
      <ManageWalkthroughAchievementRow name="Damage Dealer" href="/a274848/damage-dealer-achievement" />,
      tbody
    );

    expect(elementOf(root).tagName).toBe('TR');
    expect([...elementOf(root).children].map((cell) => cell.className)).toEqual(['point', 'c1', 'c2', 'dlop plain']);
    expect(find('.c1 a.title', root.element).getAttribute('href')).toBe('/a274848/damage-dealer-achievement');
    expect(find('.c1', root.element).textContent).toBe('Damage Dealer');
    expect(find('.c2', root.element).textContent).toBe('');
  });

  test('should render the name as text', () => {
    const tbody = find('#scrolllstWalkthroughAchievementID tbody');
    const root = mountForTest(<ManageWalkthroughAchievementRow name="<b>Damage Dealer</b>" href="/a274848" />, tbody);

    expect(find('.c1 a', root.element).textContent).toBe('<b>Damage Dealer</b>');
    expect(find('.c1 a', root.element).children).toHaveLength(0);
  });
});
