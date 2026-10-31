import { find, required, setHtml, setSettings, stillParsing, tick } from '@ta-x-test';

import { getImportedGuides } from './imported-guides';
import { isGuideSite, readGuidePage } from './read-guide-page';

describe('game/extra-guides/read-guide-page', () => {
  test.each([
    ['www.xboxachievements.com', true],
    ['www.playstationtrophies.org', true],
    ['www.gamertagnation.com', true],
    ['xboxachievements.com', true],
    ['www.trueachievements.com', false],
    // A site whose name only ends the same way
    ['notxboxachievements.com', false]
  ])('should know whether %s is a guide site', (hostname, expected) => {
    expect(isGuideSite(hostname)).toBe(expected);
  });

  test.each([
    {
      site: 'XboxAchievements',
      fixture: 'xbox-achievements-guide/mass-effect.html',
      url: 'https://www.xboxachievements.com/game/mass-effect/guide/',
      setting: 'game.extraGuides.showXboxAchievementGuides'
    },
    {
      site: 'PlaystationTrophies',
      fixture: 'playstation-trophies-guide/metal-gear-solid-3.html',
      url: 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/',
      setting: 'game.extraGuides.showPlaystationTrophyGuides'
    },
    {
      site: 'Gamertag Nation',
      fixture: 'gamertag-nation-guides/lego-pirates.html',
      url: 'https://www.gamertagnation.com/game/lego-pirates-of-the-caribbean/guides',
      setting: 'game.extraGuides.showGamertagNationGuides'
    }
  ])('should hand nothing over from $site while its guides are off', async ({ fixture, url, setting }) => {
    setHtml(`@ta-x-test-views/${fixture}`, { url });
    setSettings({ [setting]: false });

    await readGuidePage();

    expect(await getImportedGuides(url)).toBeNull();
  });

  describe('XboxAchievements', () => {
    const guideUrl = 'https://www.xboxachievements.com/game/mass-effect/guide/';

    // Soldier Ally's guide with `html` added to it, as read and handed over, parsed back
    const readSoldierAllyWith = async (html: string): Promise<Document> => {
      document.querySelectorAll('.text_res')[1].insertAdjacentHTML('beforeend', html);

      await readGuidePage();

      return new DOMParser().parseFromString(required(await getImportedGuides(guideUrl))[1].guide, 'text/html');
    };

    beforeEach(() => {
      setHtml('@ta-x-test-views/xbox-achievements-guide/mass-effect.html', { url: guideUrl });
      setSettings({ 'game.extraGuides.showXboxAchievementGuides': true });
    });

    test('should do nothing on other XboxAchievements pages', async () => {
      setHtml('@ta-x-test-views/xbox-achievements-guide/mass-effect.html', {
        url: 'https://www.xboxachievements.com/game/mass-effect/achievements/'
      });
      await readGuidePage();

      expect(await getImportedGuides('https://www.xboxachievements.com/game/mass-effect/achievements/')).toBeNull();
    });

    // The script starts before the page has loaded, and the guides are spread over several lists
    test('should read the page only once it has been parsed', async () => {
      const finishParsing = stillParsing();

      const reading = readGuidePage();
      await tick();
      expect(await getImportedGuides(guideUrl)).toBeNull();

      finishParsing();
      await reading;
      expect(await getImportedGuides(guideUrl)).toHaveLength(3);
    });

    test("should hand every list's guides over, with the achievement's page and the guide's text", async () => {
      await readGuidePage();

      const guides = await getImportedGuides(guideUrl);
      expect(required(guides).map(({ title, href }) => [title, href])).toEqual([
        ['Medal of Honor', 'https://www.xboxachievements.com/game/mass-effect/achievement/11304-medal-of-honor.html'],
        ['Soldier Ally', 'https://www.xboxachievements.com/game/mass-effect/achievement/11335-soldier-ally.html'],
        ['Colonial Savior', 'https://www.xboxachievements.com/game/mass-effect/achievement/13911-colonial-savior.html']
      ]);
      expect(required(guides)[0].guide).toBe(
        '<p style="text-align:justify">Finish the main quest. Now, I recommend you start out at Casual. No, Normal is NOT Hardcore, and Veteran is NOT Insane. So, go easy, find out where everything is at. Save your money for the next playthrough. Make sure to always use two allies and do all of the side quests with them.</p>'
      );
      expect(required(guides)[2].guide).toContain('<li style="text-align:justify">Missing Engineers</li>');
    });

    test("should still hand a guide over when its achievement's link is no address at all, linked to the guide page", async () => {
      required(document.querySelector('.achilist__header a')).setAttribute('href', 'http://');
      await readGuidePage();

      const guides = required(await getImportedGuides(guideUrl));
      expect(guides.map(({ title, href }) => [title, href])).toEqual([
        ['Medal of Honor', guideUrl],
        ['Soldier Ally', 'https://www.xboxachievements.com/game/mass-effect/achievement/11335-soldier-ally.html'],
        ['Colonial Savior', 'https://www.xboxachievements.com/game/mass-effect/achievement/13911-colonial-savior.html']
      ]);
    });

    test("should link a guide to the guide page when its achievement's link isn't a web address", async () => {
      required(document.querySelector('.achilist__header a')).setAttribute('href', 'javascript:alert(1)');
      await readGuidePage();

      expect(required(await getImportedGuides(guideUrl))[0].href).toBe(guideUrl);
    });

    test("should use TrueAchievements' buttons for its own, and keep its other pictures, which load elsewhere", async () => {
      // As its guides use them (Metal Gear Solid HD Collection's guide)
      const guide = await readSoldierAllyWith(
        '<img border="0" class="inlineimg" src="/images/misc/y.png" title="Y But"><img border="0" class="inlineimg" src="/images/misc/g-icon.gif" title="GS Icon">'
      );

      const [button, gamerscore] = [...guide.querySelectorAll('img')].slice(-2);
      expect(['src', 'alt', 'width', 'height', 'class', 'title'].map((name) => button.getAttribute(name))).toEqual([
        '/images/controllerbuttons/Xbox%20One/cn_Y.png',
        'cn_Y',
        '18',
        '18',
        null,
        null
      ]);
      expect([gamerscore.getAttribute('src'), gamerscore.getAttribute('title')]).toEqual([
        'https://www.xboxachievements.com/images/misc/g-icon.gif',
        'GS Icon'
      ]);
    });

    test("should keep a button from a site whose name only ends like the guide site's", async () => {
      const guide = await readSoldierAllyWith(
        '<img class="inlineimg" src="https://notxboxachievements.com/images/misc/y.png" title="Y But">'
      );

      const button = required([...guide.querySelectorAll('img')].at(-1));
      expect([button.getAttribute('src'), button.getAttribute('title')]).toEqual([
        'https://notxboxachievements.com/images/misc/y.png',
        'Y But'
      ]);
    });

    test("should keep a guide's links pointing where they did, and drop anything that could run", async () => {
      const guide = await readSoldierAllyWith(
        '<p onclick="alert(1)">Tip <a href="/game/mass-effect/">Mass Effect</a></p><script>alert(2)</script>'
      );
      expect([...guide.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual([
        'https://masseffect.wikia.com/wiki/Assignments',
        'https://www.xboxachievements.com/game/mass-effect/'
      ]);
      expect(guide.querySelector('script')).toBeNull();
      expect(guide.querySelector('[onclick]')).toBeNull();
    });

    test('should keep only plain formatting: no script links, embeds, forms or SVG, and of a style only its text formatting', async () => {
      const guide = await readSoldierAllyWith(
        '<p style="position:fixed;inset:0;text-align:center;color:red" class="overlay">Tip <a href="javascript:alert(1)">run</a> <img src="javascript:alert(2)" alt="x"></p>' +
          '<object data="https://example.com/x.swf"></object><embed src="https://example.com/x.swf">' +
          '<svg><a href="javascript:alert(3)"><text>svg</text></a></svg>' +
          '<form action="/account/delete"><button>Go</button></form>'
      );
      const tip = find('p:last-of-type', guide);
      expect(tip.outerHTML).toBe('<p style="text-align:center;color:red">Tip <a>run</a> <img alt="x"></p>');
      expect(guide.querySelector('object, embed, svg, form, button')).toBeNull();
      // The guide's own links stay
      expect(guide.querySelector('a[href="https://masseffect.wikia.com/wiki/Assignments"]')).not.toBeNull();
    });

    // Frames are left out: the parser drops them outside a frameset, so a guide can't hold one
    test.each([
      ['style', '<style>body{display:none}</style>'],
      ['link', '<link rel="stylesheet">'],
      ['meta', '<meta http-equiv="refresh" content="0;url=https://example.com">'],
      ['base', '<base href="https://example.com/">'],
      ['iframe', '<iframe srcdoc="<p>framed</p>"></iframe>'],
      ['applet', '<applet code="x.class"></applet>'],
      ['input', '<input name="password">'],
      ['textarea', '<textarea>text</textarea>'],
      ['select', '<select><option>one</option></select>'],
      ['math', '<math><mi>x</mi></math>'],
      ['template', '<template><p>later</p></template>'],
      ['noscript', '<noscript><p>no script</p></noscript>']
    ])("should drop a guide's %s, keeping the rest of it", async (tag, html) => {
      const guide = await readSoldierAllyWith(`<p>Tip ${html}</p>`);

      expect(guide.querySelector(tag)).toBeNull();
      expect(find('p:last-of-type', guide).textContent.trim()).toBe('Tip');
    });

    test('should open a link that names a window in a new tab, without reaching back to this one, and leave the rest', async () => {
      const guide = await readSoldierAllyWith(
        '<p><a href="https://example.com/a" target="_top">top</a> <a href="https://example.com/b">plain</a></p>'
      );
      const [top, plain] = [...find('p:last-of-type', guide).querySelectorAll('a')];

      expect([top.getAttribute('target'), top.getAttribute('rel')]).toEqual(['_blank', 'noopener noreferrer']);
      expect([plain.hasAttribute('target'), plain.hasAttribute('rel')]).toEqual([false, false]);
    });

    test('should drop a link or picture address that is no address at all, still reading the guide', async () => {
      // `new URL` throws on 'http://' (`URL.parse` gives null)
      const guide = await readSoldierAllyWith('<p>Tip <a href="http://">broken</a> <img src="http://" alt="x"></p>');

      expect(find('p:last-of-type', guide).outerHTML).toBe('<p>Tip <a>broken</a> <img alt="x"></p>');
    });

    test("should turn the guides' old YouTube Flash players into the site's lazy videos, by their id", async () => {
      // The two shapes of player in stored guides: the plain address, and one with options after it
      const guide = await readSoldierAllyWith(
        '<p><object data="https://www.youtube.com/v/o0Qif-aGLIM&amp;hl=en_US&amp;feature=player_embedded&amp;version=3" height="385" type="application/x-shockwave-flash" width="640"><param name="allowFullScreen" value="true"><param name="allowScriptAccess" value="always"><param name="src" value="https://www.youtube.com/v/o0Qif-aGLIM&amp;hl=en_US&amp;feature=player_embedded&amp;version=3"><param name="allowfullscreen" value="true"></object></p>' +
          '<p><object data="https://www.youtube.com/v/B5PSXXDSioo" height="350" style="display: block; margin-left: auto; margin-right: auto;" type="application/x-shockwave-flash" width="640"><param name="src" value="https://www.youtube.com/v/B5PSXXDSioo"></object></p>' +
          '<p><object data="https://example.com/game.swf" type="application/x-shockwave-flash"></object></p>'
      );
      // (Parsed back, each placeholder leaves its paragraph, as the site's own <p><div class="lazyYT"> does)
      expect([...guide.querySelectorAll('div')].map((div) => div.outerHTML)).toEqual([
        '<div class="lazyYT" data-youtube-id="o0Qif-aGLIM"></div>',
        '<div class="lazyYT" data-youtube-id="B5PSXXDSioo"></div>'
      ]);
      // Anything else embedded just goes
      expect(guide.querySelector('object, param')).toBeNull();
    });

    test("should keep only a video's id, so a placeholder can't carry anything else", async () => {
      const guide = await readSoldierAllyWith(
        '<p><div class="lazyYT x" data-youtube-id="o0Qif-aGLIM" style="position:fixed" onclick="alert(1)"><a href="javascript:alert(2)">x</a></div><div class="lazyYT" data-youtube-id="not an id"></div></p>'
      );
      expect([...guide.querySelectorAll('div')].map((div) => div.outerHTML)).toEqual([
        '<div class="lazyYT" data-youtube-id="o0Qif-aGLIM"></div>',
        '<div></div>'
      ]);
    });

    test('should hand no guides over for a game without any, so an import waiting for them finishes', async () => {
      const noGuideUrl = 'https://www.xboxachievements.com/game/croc-2-kingdom-of-the-gobbos/guide/';
      setHtml('@ta-x-test-views/xbox-achievements-guide/no-guide.html', { url: noGuideUrl });
      await readGuidePage();

      expect(await getImportedGuides(noGuideUrl)).toEqual([]);
    });

    test("should hand nothing over while Cloudflare's check shows at the guide page's address", async () => {
      setHtml('@ta-x-test-views/playstation-trophies-guide/cloudflare-check.html', { url: guideUrl });
      await readGuidePage();

      // The import keeps waiting: the guide page loads in the check's place once the browser passes it
      expect(GM_getValue(`importedGuides:${guideUrl}`)).toBeUndefined();
      expect(await getImportedGuides(guideUrl)).toBeNull();
    });
  });

  describe('PlaystationTrophies', () => {
    const guideUrl = 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/';

    beforeEach(() => {
      setHtml('@ta-x-test-views/playstation-trophies-guide/metal-gear-solid-3.html', { url: guideUrl });
      setSettings({ 'game.extraGuides.showPlaystationTrophyGuides': true });
    });

    test('should hand no guides over for a game without any, so an import waiting for them finishes', async () => {
      const noGuideUrl = 'https://www.playstationtrophies.org/game/croc-legend-of-the-gobbos/guide/';
      setHtml('@ta-x-test-views/playstation-trophies-guide/no-guide.html', { url: noGuideUrl });
      await readGuidePage();

      expect(await getImportedGuides(noGuideUrl)).toEqual([]);
    });

    test("should hand the page's guides over, including a trophy with no guide", async () => {
      await readGuidePage();

      expect(await getImportedGuides(guideUrl)).toEqual([
        {
          title: 'Snake Eaten',
          href: 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/trophy/38472-snake-eaten.html',
          guide: ''
        },
        {
          title: 'Young Gun',
          href: 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/trophy/38473-young-gun.html',
          guide:
            "<p>This is a storyline related trophy and cannot be missed. While you're still on Virtuous Mission you will run into Ocelot. Snake will outclass him in a cutscene, afterwards you'll earn this trophy.</p>"
        }
      ]);
    });

    // Its buttons and trophies don't load on other sites
    test("should use TrueAchievements' Xbox buttons in its PlayStation buttons' and d-pad's place", async () => {
      const mgs2Url = 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/';
      setHtml('@ta-x-test-views/playstation-trophies-guide/metal-gear-solid-2.html', { url: mgs2Url });
      await readGuidePage();

      const pictures = required(await getImportedGuides(mgs2Url)).map(({ title, guide }) => [
        title,
        [...new DOMParser().parseFromString(guide, 'text/html').querySelectorAll('img')].map((image) => image.outerHTML)
      ]);
      const button = (code: string): string =>
        `<img src="/images/controllerbuttons/Xbox%20One/${code}.png" alt="${code}" width="18" height="18">`;
      expect(pictures).toEqual([
        ['Love Hurts', [button('cn_left')]],
        ['Steel Grip', [button('cn_LT'), button('cn_RT'), button('cn_A'), button('cn_Y')]],
        ['Great Dane', [button('cn_X'), button('cn_LB')]]
      ]);
    });

    test("should put the name of a picture TrueAchievements hasn't got in its place", async () => {
      const lastOfUsUrl = 'https://www.playstationtrophies.org/game/the-last-of-us/guide/';
      setHtml('@ta-x-test-views/playstation-trophies-guide/the-last-of-us.html', { url: lastOfUsUrl });
      await readGuidePage();

      // With no alt or title, its file's name
      expect(required(await getImportedGuides(lastOfUsUrl))[0].guide).toBe(
        '<p>See <strong>Completed Grounded Mode Plus</strong>&nbsp;(trophy_gold)</p>'
      );
    });
  });

  describe('Gamertag Nation', () => {
    const guideUrl = 'https://www.gamertagnation.com/game/lego-pirates-of-the-caribbean/guides';

    beforeEach(() => {
      setHtml('@ta-x-test-views/gamertag-nation-guides/lego-pirates.html', { url: guideUrl });
      setSettings({ 'game.extraGuides.showGamertagNationGuides': true });
    });

    test("should hand each member's guide over, with its line breaks and button images, linked against the site", async () => {
      await readGuidePage();

      const guides = await getImportedGuides(guideUrl);
      expect(required(guides).map(({ title, href }) => [title, href])).toEqual([
        // The page's <base> is the site root, so its links point there, not under /game/
        ['The Curse of the Black Pearl', 'https://www.gamertagnation.com/achievements.php?a=38170'],
        ['Aye-aye, captain!', 'https://www.gamertagnation.com/achievements.php?a=38181'],
        ['Did everybody see that?', 'https://www.gamertagnation.com/achievements.php?a=38193']
      ]);
      // Without the achievement's link that heads the post, or the site's hidden "Thanks!" notice
      expect(required(guides)[0].guide).toBe('This achievement is story related and cannot be missed.');
      expect(required(guides)[1].guide).toContain('turned on as you want.<br><br> Can be done by yourself');
      // Its smilies don't load on other sites, so its A button is TrueAchievements' own
      expect(required(guides)[2].guide).toContain(
        '<img src="/images/controllerbuttons/Xbox%20One/cn_A.png" alt="A Button" width="18" height="18">'
      );
    });

    test("should still hand a guide over when its achievement's link is no address at all, linked to the guide page", async () => {
      required(document.querySelector('.user-feed-text a')).setAttribute('href', 'http://');
      await readGuidePage();

      expect(required(await getImportedGuides(guideUrl)).map(({ href }) => href)).toEqual([
        guideUrl,
        'https://www.gamertagnation.com/achievements.php?a=38181',
        'https://www.gamertagnation.com/achievements.php?a=38193'
      ]);
    });

    test("should link a guide to the guide page when its achievement's link isn't a web address", async () => {
      required(document.querySelector('.user-feed-text a')).setAttribute('href', 'javascript:alert(1)');
      await readGuidePage();

      expect(required(await getImportedGuides(guideUrl))[0].href).toBe(guideUrl);
    });

    test("should use TrueAchievements' smileys in its own's place", async () => {
      const minecraftUrl = 'https://www.gamertagnation.com/game/minecraft-xbox-360-edition/guides';
      setHtml('@ta-x-test-views/gamertag-nation-guides/minecraft.html', { url: minecraftUrl });
      await readGuidePage();

      const guide = required(await getImportedGuides(minecraftUrl))[0].guide;
      // How it ends: "Good Luck" and the site's Big Grin
      expect(guide.slice(guide.lastIndexOf('Good Luck'))).toBe(
        'Good Luck <img src="/images/smiley/laugh.gif" alt="Big Grin" width="15" height="15">'
      );
    });

    test('should hand no guides over for a game nobody has posted one for', async () => {
      const noGuidesUrl = 'https://www.gamertagnation.com/game/starfield/guides';
      setHtml('@ta-x-test-views/gamertag-nation-guides/no-guides.html', { url: noGuidesUrl });
      await readGuidePage();

      expect(await getImportedGuides(noGuidesUrl)).toEqual([]);
    });
  });
});
