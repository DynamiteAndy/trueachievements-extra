import { click, find, mountForTest, readFixtureDocument, setHtml, tick } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { getGuideLinks, setGuideLinks } from '../guide-links';
import { getReseroGuides } from '../guide-pages';
import { guideLinkSelectors, guideSitePanel } from '../guide-site-panel.spec-helpers';
import { guideSites } from '../guide-sites';
import * as importedGuidesModule from '../imported-guides';
import { getImportedGuides, handOverImportedGuides } from '../imported-guides';

import { GuideSitePanel } from './GuideSitePanel';

describe('game/extra-guides/GuideSitePanel', () => {
  const setting = 'gameAchievementsPlaystationTrophiesGuideUrl';
  const site = guideSites.find(({ id }) => id === 'playstation-trophies');
  // G-Force on PlaystationTrophies
  const gforce = 'https://www.playstationtrophies.org/game/g-force/guide/';
  const gforceGuides = () =>
    getReseroGuides(readFixtureDocument('@ta-x-test-views/playstation-trophies-guide/g-force.html'), gforce);

  const { rows, button, submit } = guideSitePanel('playstation-trophies');

  // PlaystationTrophies' tab on Combat Veteran's page on TrueAchievements, for G-Force, with G-Force's guide page linked
  // and its guides read
  // guideKnown: ImportGuides already has the guide for these links (found before the section mounted)
  const openPanel = async ({ guideKnown = false, onGuide = vi.fn() } = {}): Promise<void> => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    if (!site) {
      throw new Error('no PlaystationTrophies site');
    }
    handOverImportedGuides(gforce, gforceGuides());
    const guides = (await getImportedGuides(gforce))?.length ?? null;
    // In its tab panel, which the spec helper finds it by, and a box in that, as the loader's is on the page
    const tabPanel = document.body.appendChild(document.createElement('div'));
    tabPanel.id = 'ta-x-tabs-playstation-trophies';
    const container = tabPanel.appendChild(document.createElement('div'));
    onTestFinished(() => tabPanel.remove());

    const initialLinks = [{ url: gforce, guides, importing: false }];

    await act(() => {
      mountForTest(
        <GuideSitePanel
          site={site}
          initialLinks={initialLinks}
          achievementTitle="Combat Veteran"
          guideFoundFor={guideKnown ? initialLinks : undefined}
          onGuide={onGuide}
          onLinks={vi.fn()}
        />,
        container
      );
    });
  };

  test('should look up the guide for links it has no guide for, handing it up with those links', async () => {
    const onGuide = vi.fn();
    await openPanel({ onGuide });

    await vi.waitFor(() => expect(onGuide).toHaveBeenCalledOnce());
    const [guide, foundFor] = onGuide.mock.calls[0];
    expect(guide?.url).toBe(gforce);
    expect(foundFor).toEqual([expect.objectContaining({ url: gforce })]);
  });

  test('should read nothing on opening when the guide for its links is already known', async () => {
    const onGuide = vi.fn();
    const read = vi.spyOn(importedGuidesModule, 'getImportedGuides');
    await openPanel({ guideKnown: true, onGuide });

    // Time for a look-up's IndexedDB read to have answered, had one started
    await tick();

    // Only the read that set the test up
    expect(read).toHaveBeenCalledOnce();
    expect(onGuide).not.toHaveBeenCalled();
  });

  test('should look the guide up again once its links change', async () => {
    const onGuide = vi.fn();
    setGuideLinks(setting, 'GForce', [gforce]);
    await openPanel({ guideKnown: true, onGuide });

    click(find(guideLinkSelectors.removeLink, rows()[0]));

    await vi.waitFor(() => expect(onGuide).toHaveBeenCalledWith(null, []));
  });

  test('should add nothing for a guide page that is already linked, reading nothing again', async () => {
    setGuideLinks(setting, 'GForce', [gforce]);
    await openPanel();

    click(find(guideLinkSelectors.addLink));
    await vi.waitFor(() => expect(button().value).toBe('Add'));
    submit(gforce);

    expect(rows()).toHaveLength(1);
    expect(getGuideLinks(setting, 'GForce')).toEqual([gforce]);
    expect(GM_openInTab).not.toHaveBeenCalled();
  });

  test("should keep a removed guide page's guides while another game still links it", async () => {
    // A collection's games can share a guide page
    setGuideLinks(setting, 'GForce', [gforce]);
    setGuideLinks(setting, 'Metal-Gear-Solid-HD-Collection', [gforce]);
    const forget = vi.spyOn(importedGuidesModule, 'forgetImportedGuides');
    await openPanel();

    click(find(guideLinkSelectors.removeLink, rows()[0]));

    await vi.waitFor(() => expect(rows()).toHaveLength(0));
    expect(getGuideLinks(setting, 'GForce')).toEqual([]);
    expect(forget).not.toHaveBeenCalled();
    expect(await getImportedGuides(gforce)).not.toBeNull();
  });

  test("should forget a removed guide page's guides once no game links it", async () => {
    setGuideLinks(setting, 'GForce', [gforce]);
    await openPanel();

    click(find(guideLinkSelectors.removeLink, rows()[0]));

    await vi.waitFor(async () => expect(await getImportedGuides(gforce)).toBeNull());
  });
});
