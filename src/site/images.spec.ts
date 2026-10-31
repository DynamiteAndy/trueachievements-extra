import {
  controllerButtons,
  controllerButtonSize,
  controllerButtonSrc,
  controllerButtonStaticFolder,
  smileys,
  smileySrc
} from './images';

describe('site/images', () => {
  test("should list the site's 20 smileys once each, starting with smile and ending with rock", () => {
    const names = smileys.map(({ name }) => name);

    expect(names).toHaveLength(20);
    expect(new Set(names).size).toBe(20);
    expect([names[0], names.at(-1)]).toEqual(['smile', 'rock']);
    expect(smileys.find(({ name }) => name === 'angry')).toEqual({ name: 'angry', width: 18, height: 16 });
  });

  test("should list the site's 40 controller buttons once each, ten rows of four in its menus' order", () => {
    expect(controllerButtons).toHaveLength(40);
    expect(new Set(controllerButtons).size).toBe(40);
    // Each row's first, as the walkthrough editor's menu starts its rows
    expect(controllerButtons.filter((_, index) => index % 4 === 0)).toEqual([
      'cn_A',
      'cn_LB',
      'cn_up',
      'cn_upleft',
      'cn_LSu',
      'cn_LSul',
      'cn_RSu',
      'cn_RSul',
      'cn_dpad',
      'cn_RS'
    ]);
    expect(controllerButtons.at(-1)).toBe('cn_guide');
  });

  test("should point at the site's own pictures", () => {
    expect(smileySrc('wink')).toBe('/images/smiley/wink.gif');
    expect(controllerButtonSrc('cn_A')).toBe('/images/controllerbuttons/Xbox%20One/cn_A.png');
    expect(controllerButtonSize).toBe(18);
    expect(controllerButtonStaticFolder).toBe('//static.trueachievements.com/images/controllerbuttons/Xbox One/');
  });
});
