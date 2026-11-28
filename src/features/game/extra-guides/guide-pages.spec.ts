import { find, readFixtureDocument } from '@ta-x-test';

import { cleanGuideHtml } from './guide-pages';

// The guide sites' button and smiley pictures become TrueAchievements' own (guideSiteImages). The rest is
// read-guide-page.spec's, on whole guides
describe('game/extra-guides/guide-pages', () => {
  // A picture as a guide site serves it (PlaystationTrophies' d-pad left in Metal Gear Solid 2 HD's guide, Gamertag
  // Nation's Big Grin in Minecraft's), its file swapped for `file`
  const sites = [
    {
      site: 'PlaystationTrophies',
      fixture: '@ta-x-test-views/playstation-trophies-guide/metal-gear-solid-2.html',
      baseUrl: 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/',
      picture: 'img[src*="DpadLeft"]',
      file: 'DpadLeft.png'
    },
    {
      site: 'Gamertag Nation',
      fixture: '@ta-x-test-views/gamertag-nation-guides/minecraft.html',
      baseUrl: 'https://www.gamertagnation.com/',
      picture: 'img[src*="grin.gif"]',
      file: 'grin.gif'
    }
  ];
  const pictureAs = ({ fixture, picture, file }: (typeof sites)[number], newFile: string): string => {
    const image = find(picture, readFixtureDocument(fixture).body);
    image.setAttribute('src', (image.getAttribute('src') ?? '').replace(file, newFile));

    return image.outerHTML;
  };

  // The d-pad's five pictures, which the two sites name the same (shared by their maps)
  test.each(sites)("should use TrueAchievements' d-pad buttons for $site's", (site) => {
    const files = ['Dpad.png', 'DpadUp.png', 'DpadRight.png', 'DpadDown.png', 'DpadLeft.png'];

    const cleaned = cleanGuideHtml(files.map((file) => pictureAs(site, file)).join(''), site.baseUrl);

    expect(
      [...new DOMParser().parseFromString(cleaned, 'text/html').querySelectorAll('img')].map((image) => [
        image.getAttribute('src'),
        image.getAttribute('width'),
        image.getAttribute('height')
      ])
    ).toEqual(
      ['cn_dpad', 'cn_up', 'cn_right', 'cn_down', 'cn_left'].map((code) => [
        `/images/controllerbuttons/Xbox%20One/${code}.png`,
        '18',
        '18'
      ])
    );
  });
});
