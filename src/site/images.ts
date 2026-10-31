// The site's own smileys and controller buttons, which it inserts as `[<name>]`. Shared by the emoji picker, the
// walkthrough editor's Controller Buttons menu and imported guides (which swap other sites' smilies for these)

// In the site's order and sizes
export const smileys = [
  { name: 'smile', width: 15, height: 15 },
  { name: 'laugh', width: 15, height: 15 },
  { name: 'wink', width: 15, height: 15 },
  { name: 'redface', width: 15, height: 15 },
  { name: 'angry', width: 18, height: 16 },
  { name: 'cry', width: 15, height: 15 },
  { name: 'roll', width: 15, height: 15 },
  { name: 'shock', width: 15, height: 15 },
  { name: 'warning', width: 22, height: 19 },
  { name: 'clap', width: 30, height: 15 },
  { name: 'dance', width: 25, height: 29 },
  { name: 'music', width: 32, height: 25 },
  { name: 'wave', width: 25, height: 15 },
  { name: 'sleep', width: 45, height: 18 },
  { name: 'headspin', width: 37, height: 23 },
  { name: 'facepalm', width: 22, height: 16 },
  { name: 'compute', width: 40, height: 20 },
  { name: 'toast', width: 57, height: 16 },
  { name: 'dive', width: 34, height: 33 },
  { name: 'rock', width: 29, height: 25 }
] as const;

export type Smiley = (typeof smileys)[number]['name'];

export const smileySrc = (name: Smiley): string => `/images/smiley/${name}.gif`;

const buttons = [
  'A',
  'B',
  'X',
  'Y',
  'LB',
  'RB',
  'LT',
  'RT',
  'up',
  'down',
  'left',
  'right',
  'upleft',
  'upright',
  'downleft',
  'downright',
  'LSu',
  'LSd',
  'LSl',
  'LSr',
  'LSul',
  'LSur',
  'LSdl',
  'LSdr',
  'RSu',
  'RSd',
  'RSl',
  'RSr',
  'RSul',
  'RSur',
  'RSdl',
  'RSdr',
  'dpad',
  'LSc',
  'RSc',
  'LS',
  'RS',
  'back',
  'start',
  'guide'
] as const;

export type ControllerButton = `cn_${(typeof buttons)[number]}`;

// In the site's order: its menus show them four to a row
export const controllerButtons: ControllerButton[] = buttons.map((button): ControllerButton => `cn_${button}`);

// Every controller button's picture is this size
export const controllerButtonSize = 18;

// The same pictures' folder on the site's image host, as the walkthrough editor's Controller Buttons menu shows them
// (the site's own menu does the same)
export const controllerButtonStaticFolder = '//static.trueachievements.com/images/controllerbuttons/Xbox One/';

export const controllerButtonSrc = (code: ControllerButton): string =>
  `/images/controllerbuttons/Xbox%20One/${code}.png`;
