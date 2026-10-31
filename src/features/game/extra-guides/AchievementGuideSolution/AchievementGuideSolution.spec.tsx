import { find, mountForTest, renderElement } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { GamertagNationIcon } from '../icons/GamertagNationIcon';

import { AchievementGuideSolution } from './AchievementGuideSolution';

describe('game/extra-guides/AchievementGuideSolution', () => {
  test("renders the guide like the site's own solutions: the site in the gamer column, then the guide", () => {
    // Gamertag Nation's guide for Did everybody see that? (LEGO Pirates of the Caribbean)
    const solution = renderElement(
      <AchievementGuideSolution
        name="Gamertag Nation"
        icon={<GamertagNationIcon class="ta-x-gamertagnation-icon" />}
        href="https://www.gamertagnation.com/achievements.php?a=38193"
        info="This guide was imported from GamertagNation.com"
        guide='Follow Davy Jones to the highest mast, then press <img src="/images/controllerbuttons/Xbox%20One/cn_A.png" alt="A Button" width="18" height="18"> twice.'
      />
    );

    expect(solution.tagName).toBe('LI');
    const gamer = find('.gamer', solution);
    expect(gamer.className).toBe('gamer ta-x-achievement-guide');
    expect([...gamer.children].map((child) => child.tagName.toLowerCase())).toEqual(['svg', 'a', 'div']);
    expect(find('svg', gamer).getAttribute('class')).toBe('ta-x-gamertagnation-icon');
    const link = find('a', gamer);
    expect([
      link.getAttribute('href'),
      link.getAttribute('rel'),
      link.getAttribute('data-tlite'),
      link.textContent
    ]).toEqual(['https://www.gamertagnation.com/achievements.php?a=38193', 'nofollow', '', 'Gamertag Nation']);
    expect(find('.info', gamer).textContent).toBe('This guide was imported from GamertagNation.com');
    expect(find('article > .body', solution).innerHTML).toBe(
      'Follow Davy Jones to the highest mast, then press <img src="/images/controllerbuttons/Xbox%20One/cn_A.png" alt="A Button" width="18" height="18"> twice.'
    );
  });

  test('leaves out a stored link to the guide that is no web address', () => {
    // A guide stored by an older version, whose link wasn't checked when it was read
    const solution = renderElement(
      <AchievementGuideSolution
        name="Gamertag Nation"
        icon={null}
        href="javascript:alert(1)"
        info="This guide was imported from GamertagNation.com"
        guide="Follow Davy Jones to the highest mast."
      />
    );

    const link = find('.gamer a', solution);
    expect([link.hasAttribute('href'), link.textContent]).toEqual([false, 'Gamertag Nation']);
  });

  test("shows the guide's videos like the site's own, where the cleaner left their placeholders", async () => {
    const list = document.body.appendChild(document.createElement('ul'));
    onTestFinished(() => list.remove());
    await act(() => {
      mountForTest(
        <AchievementGuideSolution
          name="PlaystationTrophies"
          icon={null}
          href="https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/trophy/1-down-in-smoke.html"
          info="This guide was imported from PlaystationTrophies.org"
          guide='<p>Watch this:</p><p><div class="lazyYT" data-youtube-id="o0Qif-aGLIM"></div></p><p>Done.</p>'
        />,
        list
      );
    });

    const body = find('article > .body', list);
    expect(body.querySelectorAll('.lazyYT')).toHaveLength(1);
    const video = find('.lazyYT', body);
    expect(video.className).toBe('lazyYT lazyYT-container');
    // The video itself (its thumbnail and player) is YouTubeVideo's: its spec checks them
    expect(video.getAttribute('data-youtube-id')).toBe('o0Qif-aGLIM');
    expect(body.textContent).toBe('Watch this:Done.');
  });

  test.each([
    {
      // Close Shave (Metal Gear Solid HD Edition), as stored before its buttons were TrueAchievements': the site's own
      // address, which TrueAchievements doesn't have
      site: 'XboxAchievements',
      href: 'https://www.xboxachievements.com/game/metal-gear-solid-hd-collection/achievement/61613-close-shave.html',
      button: '<img src="/images/misc/y.png" title="Y But">',
      expected: '<img src="/images/controllerbuttons/Xbox%20One/cn_Y.png" alt="cn_Y" width="18" height="18">'
    },
    {
      // The same achievement's trophy: the site's pictures don't load on other sites
      site: 'PlaystationTrophies',
      href: 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/trophy/38485-close-shave.html',
      button: '<img src="https://www.playstationtrophies.org/forum/images/smilies/circle18x18.png">',
      expected: '<img src="/images/controllerbuttons/Xbox%20One/cn_B.png" alt="cn_B" width="18" height="18">'
    }
  ])("uses TrueAchievements' buttons in a guide $site stored with its own", ({ site, href, button, expected }) => {
    const solution = renderElement(
      <AchievementGuideSolution name={site} icon={null} href={href} info="" guide={`Press ${button}.`} />
    );

    expect(find('article > .body', solution).innerHTML).toBe(`Press ${expected}.`);
  });

  test('cleans a guide stored by an older version, which kept script links and embeds', () => {
    const solution = renderElement(
      <AchievementGuideSolution
        name="XboxAchievements"
        icon={null}
        href="https://www.xboxachievements.com/game/mass-effect/achievement/11304-medal-of-honor.html"
        info="This guide was imported from XboxAchievements.com"
        guide='<p style="text-align:justify">Finish the <a href="javascript:alert(1)">main quest</a>.</p><object data="https://example.com/x.swf"></object>'
      />
    );

    expect(find('article > .body', solution).innerHTML).toBe(
      '<p style="text-align:justify">Finish the <a>main quest</a>.</p>'
    );
  });
});
