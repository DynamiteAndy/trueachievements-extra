import { find, mountForTest, renderElement, required, setSettings } from '@ta-x-test';
import { AskLoaderStyles, TabsStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import { guideSites } from '../guide-sites';
import ImportGuidesStyles from '../styles';
import SectionStyles from '../TabbedSection/styles';

import type { LoadedGuideSite } from '../guide-site-links';
import type { GuideSiteId } from '../guide-site-list';

import { ImportGuides } from './ImportGuides';

describe('game/extra-guides/ImportGuides', () => {
  // Every site, each loaded with no links, as the page loads them
  const nothingLinked: LoadedGuideSite = { links: [], guide: null };
  const props = () => ({
    sites: guideSites,
    initialLoaded: Object.fromEntries(guideSites.map(({ id }) => [id, nothingLinked])) as Record<
      GuideSiteId,
      LoadedGuideSite
    >,
    achievementTitle: null
  });

  beforeEach(() => {
    setSettings({
      'game.extraGuides.showXboxAchievementGuides': true,
      'game.extraGuides.showPlaystationTrophyGuides': true,
      'game.extraGuides.showGamertagNationGuides': true
    });
  });

  // A tab panel's id: its group's page-unique id (useTabs), then the tab's
  const panelId = (id: string) => expect.stringMatching(new RegExp(`^ta-x-tabs-group-\\d+-${id}$`));

  test('renders a tabbed section, with a tab for each guide site across its top', () => {
    const section = renderElement(<ImportGuides {...props()} />);

    // The section and its tab bar are TabbedSection's (its spec checks them): the guides add their own classes
    expect(section.className).toBe(`${SectionStyles.tabbedSection} ${ImportGuidesStyles.importGuides}`);

    const list = find(':scope > ul', section);
    expect(
      [...list.children].map((link) => [
        link.textContent,
        link.getAttribute('aria-controls'),
        link.getAttribute('aria-selected')
      ])
    ).toEqual([
      ['Xbox Achievements', panelId('xbox-achievements'), 'true'],
      ['Playstation Trophies', panelId('playstation-trophies'), 'false'],
      ['Gamertag Nation', panelId('gamertag-nation'), 'false']
    ]);
  });

  test('gives each site a loaded ask loader, holding its linked pages (asking for one when it has none)', () => {
    const section = renderElement(<ImportGuides {...props()} />);
    const contents = [...section.querySelectorAll(`:scope > article > .${TabsStyles.tabsContent}`)];

    expect(contents.map((content) => [content.id, content.hasAttribute('data-tab-visible')])).toEqual([
      [panelId('xbox-achievements'), true],
      [panelId('playstation-trophies'), false],
      [panelId('gamertag-nation'), false]
    ]);
    const panels = contents.map((content) => content.firstElementChild);
    panels.forEach((panel) => expect(required(panel)).toHaveExactClasses([AskLoaderStyles.askLoaderContainer]));
    expect(panels.map((panel) => required(panel).getAttribute('data-ta-x-loaded'))).toEqual(['true', 'true', 'true']);
    expect(
      panels.map(
        (panel) => required(panel).querySelector(`:scope > .${ImportGuidesStyles.guideLinks} label`)?.textContent
      )
    ).toEqual(['XboxAchievements Url', 'PlaystationTrophies Url', 'GamertagNation Url']);
  });

  test('renders a tab only for the sites turned on, showing the first', () => {
    setSettings({ 'game.extraGuides.showXboxAchievementGuides': false });
    const section = renderElement(<ImportGuides {...props()} />);

    expect(
      [...section.querySelectorAll(`.${TabsStyles.tabsLink}`)].map((link) => [
        link.textContent,
        link.getAttribute('aria-selected')
      ])
    ).toEqual([
      ['Playstation Trophies', 'true'],
      ['Gamertag Nation', 'false']
    ]);
    expect(find('[data-tab-visible]', section).id).toEqual(panelId('playstation-trophies'));
  });

  test("switches to a guide site's panel when its tab is clicked", async () => {
    const container = document.createElement('div');
    await act(() => {
      mountForTest(<ImportGuides {...props()} />, container);
    });
    const links = [...container.querySelectorAll<HTMLElement>(`.${TabsStyles.tabsLink}`)];

    await act(() => links[2].click());

    expect(links.map((link) => link.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
    expect(find('[data-tab-visible]', container).id).toEqual(panelId('gamertag-nation'));
  });
});
