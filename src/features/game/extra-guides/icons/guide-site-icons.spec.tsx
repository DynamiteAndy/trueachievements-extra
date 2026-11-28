import { find, mountInPage } from '@ta-x-test';

import type { FunctionComponent } from 'preact';

import { GamertagNationIcon } from './GamertagNationIcon';
import { PlaystationTrophiesIcon } from './PlaystationTrophiesIcon';
import { XboxAchievementsIcon } from './XboxAchievementsIcon';

describe('game/extra-guides/icons (the guide site logos)', () => {
  // Mounted, as the feature does: rendering to a string would also accept camelCase attributes that SVG ignores
  const render = (Icon: FunctionComponent<{ class?: string }>): SVGSVGElement =>
    mountInPage(<Icon class="ta-x-icon" />).container.firstElementChild as SVGSVGElement;

  test.each([
    { name: 'XboxAchievements', Icon: XboxAchievementsIcon, viewBox: '0 0 62 62' },
    { name: 'PlaystationTrophies', Icon: PlaystationTrophiesIcon, viewBox: '0 0 62 62' },
    { name: 'GamertagNation', Icon: GamertagNationIcon, viewBox: '0 0 225 225' }
  ])("should render $name's logo as an SVG with the given classes", ({ Icon, viewBox }) => {
    const svg = render(Icon);

    expect([svg.tagName.toLowerCase(), svg.getAttribute('class'), svg.getAttribute('viewBox')]).toEqual([
      'svg',
      'ta-x-icon',
      viewBox
    ]);
    // Beside the site's name, so only decoration
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  test.each([
    { name: 'XboxAchievements', Icon: XboxAchievementsIcon },
    { name: 'PlaystationTrophies', Icon: PlaystationTrophiesIcon }
  ])("should give each of $name's logos a gradient of its own, so two on a page don't share an id", ({ Icon }) => {
    const gradients = [render(Icon), render(Icon)].map((svg) => {
      const { id } = find('linearGradient', svg);
      expect(find('[fill^="url("]', svg).getAttribute('fill')).toBe(`url(#${id})`);

      return id;
    });

    expect(gradients[0]).not.toBe(gradients[1]);
  });

  test("should draw each site's own logo", () => {
    const xbox = render(XboxAchievementsIcon);
    expect(find('stop', xbox).getAttribute('stop-color')).toBe('#03BF2D');
    expect(find('g', xbox).getAttribute('fill-rule')).toBe('evenodd');

    const playstation = render(PlaystationTrophiesIcon);
    expect(find('stop', playstation).getAttribute('stop-color')).toBe('#09489B');
    expect(find('path', playstation).getAttribute('fill-rule')).toBe('nonzero');

    // A circle like the other guide sites' logos, with GTN drawn as rounded strokes rather than text
    const gamertagNation = render(GamertagNationIcon);
    expect(find('circle', gamertagNation).getAttribute('fill')).toBe('#363B40');
    expect(gamertagNation.querySelector('text')).toBeNull();
    expect(gamertagNation.querySelectorAll('g[stroke="#FFFFFF"] path')).toHaveLength(3);
    expect(find('line', gamertagNation).getAttribute('stroke-width')).toBe('15');
  });
});
