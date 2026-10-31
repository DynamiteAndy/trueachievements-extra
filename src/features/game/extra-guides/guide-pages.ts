import {
  controllerButtonSize,
  controllerButtonSrc,
  smileys,
  smileySrc,
  type ControllerButton,
  type Smiley,
  onHost
} from '@ta-x-site';

import type { ImportedGuide } from './imported-guide';

// A guide site's button or smiley as one of TrueAchievements' own (@ta-x-site's images), at its size
type SiteImage = { src: string; alt: string; size: number[] };

const controllerButton = (code: ControllerButton): SiteImage => ({
  src: controllerButtonSrc(code),
  alt: code,
  size: [controllerButtonSize, controllerButtonSize]
});
const smiley = (name: Smiley): SiteImage => {
  const { width, height } = smileys.find((site) => site.name === name) ?? { width: 15, height: 15 };

  return { src: smileySrc(name), alt: name, size: [width, height] };
};

// The face buttons, bumpers, triggers and sticks, by the same file names on Gamertag Nation and XboxAchievements
const xboxButtonImages: Record<string, SiteImage> = {
  'a.png': controllerButton('cn_A'),
  'b.png': controllerButton('cn_B'),
  'x.png': controllerButton('cn_X'),
  'y.png': controllerButton('cn_Y'),
  'lb.png': controllerButton('cn_LB'),
  'rb.png': controllerButton('cn_RB'),
  'lt.png': controllerButton('cn_LT'),
  'rt.png': controllerButton('cn_RT'),
  'ls.png': controllerButton('cn_LS'),
  'rs.png': controllerButton('cn_RS')
};

// The d-pad, by the same file names on Gamertag Nation and PlaystationTrophies
const dpadImages: Record<string, SiteImage> = {
  'dpad.png': controllerButton('cn_dpad'),
  'dpadup.png': controllerButton('cn_up'),
  'dpadright.png': controllerButton('cn_right'),
  'dpaddown.png': controllerButton('cn_down'),
  'dpadleft.png': controllerButton('cn_left')
};

interface GuideSiteImages {
  host: string;
  folder: string;
  loadsElsewhere: boolean;
  images: Record<string, SiteImage>;
}

// Each guide site's folder of buttons and smilies, by lower-case file name. `loadsElsewhere`: whether its pictures
// load on TrueAchievements; those that don't, and that TrueAchievements has no equivalent for (e.g. Gamertag Nation's
// Party, PlaystationTrophies' trophies and touchpad), become their name as text.
const guideSiteImages: GuideSiteImages[] = [
  {
    // From its misc.php?do=showsmilies. They don't load on other sites
    host: 'gamertagnation.com',
    folder: '/images/smilies/',
    loadsElsewhere: false,
    images: {
      ...xboxButtonImages,
      ...dpadImages,
      // The Menu and View buttons, and the Xbox 360's Start and Back
      'start.png': controllerButton('cn_start'),
      'start-360.png': controllerButton('cn_start'),
      'view.png': controllerButton('cn_back'),
      'back.png': controllerButton('cn_back'),
      'smile.gif': smiley('smile'),
      'smirk.gif': smiley('wink'),
      'grin.gif': smiley('laugh'),
      'lol.gif': smiley('laugh'),
      'blush.gif': smiley('redface'),
      'really2.gif': smiley('roll'),
      'mad.gif': smiley('angry'),
      'snooze.gif': smiley('sleep'),
      'cry.gif': smiley('cry')
    }
  },
  {
    // Its guides' buttons (found on its guide pages). They load elsewhere, so its others (e.g. its gamerscore icon,
    // g-icon.gif) are kept
    host: 'xboxachievements.com',
    folder: '/images/misc/',
    loadsElsewhere: true,
    images: {
      ...xboxButtonImages,
      'back.png': controllerButton('cn_back'),
      'start.png': controllerButton('cn_start')
    }
  },
  {
    // Its guides' buttons and trophies (found on its guide pages). They don't load on other sites. Its PlayStation
    // buttons become the Xbox buttons in their place (Cross is A, L1 is LB, Select is View)
    host: 'playstationtrophies.org',
    folder: '/forum/images/smilies/',
    loadsElsewhere: false,
    images: {
      'cross18x18.png': controllerButton('cn_A'),
      'circle18x18.png': controllerButton('cn_B'),
      'square18x18.png': controllerButton('cn_X'),
      'triangle18x18.png': controllerButton('cn_Y'),
      'l_1.png': controllerButton('cn_LB'),
      'l1.png': controllerButton('cn_LB'),
      'r_1.png': controllerButton('cn_RB'),
      'r1.png': controllerButton('cn_RB'),
      'l2.png': controllerButton('cn_LT'),
      'r2.png': controllerButton('cn_RT'),
      'ls18x18.png': controllerButton('cn_LS'),
      'rs18x18.png': controllerButton('cn_RS'),
      'l318x18.png': controllerButton('cn_LSc'),
      'r318x18.png': controllerButton('cn_RSc'),
      ...dpadImages,
      'select2button.png': controllerButton('cn_back'),
      'startbutton.png': controllerButton('cn_start')
    }
  }
];

// TrueAchievements' own pictures, which a guide site's become
const isTrueAchievementsImage = (src: string): boolean => /^\/images\/(?:smiley|controllerbuttons)\//.test(src);

// A guide's pictures made absolute to its guide site (baseUrl), and its site's buttons and smilies TrueAchievements'
// own (guideSiteImages). Run when a guide is read and again when it's shown, for guides read by an older version.
const swapInTrueAchievementsImages = (guide: Element, baseUrl: string): void => {
  guide.querySelectorAll('img[src]').forEach((image) => {
    const src = image.getAttribute('src') ?? '';

    if (isTrueAchievementsImage(src)) {
      return;
    }

    // Null where it's no address at all ('http://'): such a picture loses its address in cleanGuide, rather than the
    // whole guide page failing to read
    const url = URL.parse(src, baseUrl);
    if (!url) {
      return;
    }

    const file = url.pathname.split('/').pop()?.toLowerCase() ?? '';
    const site = guideSiteImages.find(
      ({ host, folder }) => onHost(url.hostname, host) && url.pathname.startsWith(folder)
    );
    const siteImage = site?.images[file];

    // Its title goes too: the site's name for it can be another button's (a Cross is "X Button")
    if (siteImage) {
      image.setAttribute('src', siteImage.src);
      image.setAttribute('alt', image.getAttribute('alt') || siteImage.alt);
      image.setAttribute('width', siteImage.size[0].toString());
      image.setAttribute('height', siteImage.size[1].toString());
      image.removeAttribute('class');
      image.removeAttribute('title');
      return;
    }

    if (site && !site.loadsElsewhere) {
      image.replaceWith(`(${image.getAttribute('alt') || image.getAttribute('title') || file.replace(/\.\w+$/, '')})`);
      return;
    }

    image.setAttribute('src', url.href);
  });
};

// Guides are written by the guide sites' members and shown on TrueAchievements, where the gamer is signed in, so only
// plain formatting is kept: no element that can run, embed or submit anything (the guides' only embeds were
// YouTube Flash players no browser plays any more), no attribute but these, links and images only to web
// addresses, and of a style only what the guides use to format text
const unsafeElements =
  'script, style, link, meta, base, iframe, frame, frameset, object, embed, applet, form, input, button, textarea, select, svg, math, template, noscript';
const keptAttributes = ['href', 'src', 'alt', 'title', 'width', 'height', 'align', 'border', 'target', 'style'];
const keptStyles = ['text-align', 'text-decoration', 'color'];
export const isWebAddress = (value: string): boolean =>
  ['http:', 'https:'].includes(URL.parse(value, window.location.href)?.protocol ?? '');

// A YouTube video's id, in the address of its old Flash player (youtube.com/v/<id>, sometimes followed by &hl=…
// options)
const youTubePlayerId = /^https?:\/\/(?:www\.)?youtube\.com\/v\/([\w-]{11})(?:[&?#]|$)/;
const youTubeId = /^[\w-]{11}$/;

// A video in the site's own markup for one (its lazyYT placeholder, shown by YouTubeVideo), keeping only its id
const isVideoPlaceholder = (element: Element): boolean =>
  element.matches('div.lazyYT') && youTubeId.test(element.getAttribute('data-youtube-id') ?? '');

const cleanGuide = (guide: Element): void => {
  // The guides' old YouTube Flash players, which no browser plays any more, become the site's own lazy videos
  guide.querySelectorAll('object').forEach((player) => {
    const id = (player.getAttribute('data') ?? '').match(youTubePlayerId)?.[1];

    if (id) {
      const video = guide.ownerDocument.createElement('div');
      video.className = 'lazyYT';
      video.setAttribute('data-youtube-id', id);
      player.replaceWith(video);
    }
  });

  guide.querySelectorAll(unsafeElements).forEach((element) => element.remove());
  guide.querySelectorAll('*').forEach((element) => {
    if (isVideoPlaceholder(element)) {
      element.replaceChildren();
      [...element.attributes]
        .filter(({ name }) => name !== 'class' && name !== 'data-youtube-id')
        .forEach(({ name }) => element.removeAttribute(name));
      element.className = 'lazyYT';
      return;
    }

    [...element.attributes]
      .filter(({ name }) => !keptAttributes.includes(name.toLowerCase()))
      .forEach(({ name }) => element.removeAttribute(name));

    const style = keptStyles
      .map((property) => [property, (element as HTMLElement).style?.getPropertyValue(property)])
      .filter(([, value]) => value)
      .map(([property, value]) => `${property}:${value}`)
      .join(';');
    element.removeAttribute('style');
    if (style) {
      element.setAttribute('style', style);
    }

    // A link may open in a new tab, without reaching back to this one
    if (element.hasAttribute('target')) {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }

    ['href', 'src']
      .filter((name) => element.hasAttribute(name) && !isWebAddress(element.getAttribute(name) ?? ''))
      .forEach((name) => element.removeAttribute(name));
  });
};

// A stored guide's HTML cleaned again before it's shown, as one read by an older version was cleaned less (and its
// pictures left as the guide site's): baseUrl is the guide's page on the guide site
export const cleanGuideHtml = (html: string, baseUrl: string): string => {
  const guide = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body;
  swapInTrueAchievementsImages(guide, baseUrl);
  cleanGuide(guide);

  return guide.innerHTML;
};

// A guide's text, with its links and images made absolute to the guide site (its buttons and smilies
// TrueAchievements' own), and cleaned
const getGuideHtml = (text: Element, baseUrl: string): string => {
  const guide = text.cloneNode(true) as Element;
  guide.querySelectorAll('a[href]').forEach((link) => {
    const url = URL.parse(link.getAttribute('href') ?? '', baseUrl);
    // One that's no address keeps it, for cleanGuide to drop
    if (url) {
      link.setAttribute('href', url.href);
    }
  });
  swapInTrueAchievementsImages(guide, baseUrl);
  cleanGuide(guide);

  return guide.innerHTML.trim();
};

// The guide's own link on its guide site, made absolute, or the guide page where it's no web address (only web
// addresses are kept, as in the guide's text)
const guideHref = (link: Element | null, baseUrl: string, guideUrl: string): string => {
  const url = link && URL.parse(link.getAttribute('href') ?? '', baseUrl);

  return url && isWebAddress(url.href) ? url.href : guideUrl;
};

// Every achievement's guide on a Resero Network (XboxAchievements, PlaystationTrophies) game guide page
export const getReseroGuides = (guideDocument: Document, guideUrl: string): ImportedGuide[] =>
  [...guideDocument.querySelectorAll('.achilist .achilist__guide')].map((item) => {
    const link = item.querySelector('.achilist__header a');

    return {
      title: item.querySelector('.achilist__title')?.textContent.trim() ?? '',
      href: guideHref(link, guideUrl, guideUrl),
      guide: [...item.querySelectorAll('.text_res')].map((text) => getGuideHtml(text, guideUrl)).join('<br>')
    };
  });

// Every achievement's guide on a Gamertag Nation game guides page. Each is a member's post: the achievement's link,
// then the guide as loose text (with line breaks and button images). The page sets a <base> at the site root, which
// its relative links resolve against.
export const getGamertagNationGuides = (guideDocument: Document, guideUrl: string): ImportedGuide[] => {
  const baseUrl = guideDocument.querySelector('base')?.getAttribute('href') ?? guideUrl;

  return [...guideDocument.querySelectorAll('.content li[id^="guide-"]')].flatMap((item) => {
    const post = item.querySelector('.user-feed-addon');
    if (!post) {
      return [];
    }

    const addon = post.cloneNode(true) as Element;
    const link = addon.querySelector('.user-feed-text a');

    // The achievement's link heads the post, and the site's hidden "Thanks!" notice for reporting it follows
    addon.querySelector('.user-feed-text')?.remove();
    addon.querySelector('.alert')?.remove();

    return {
      title: link?.textContent.trim() ?? '',
      href: guideHref(link, baseUrl, guideUrl),
      guide: getGuideHtml(addon, baseUrl)
    };
  });
};
