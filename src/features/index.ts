export { settingsMenu } from './settings-tabs';
export { default as allPages, forgetGiveawayTries } from './all-pages';
export { default as staffWalkthrough } from './staff/walkthrough';
export { default as forum } from './forum';
export { default as news } from './news';
export { default as game } from './game';
export { default as gamesList } from './games-list';
export { default as gamer } from './gamer';
export { readGuidePage, isGuideSite } from './game';
// For the maintenance task (src/maintenance.ts): the hand-over it takes, and the stored lists it carries over and
// sweeps
export { forgetUnlinkedGuidePages, takeAllHandedOverGuides } from './game';
export { carryOverOwnerProgressUrls, ownerProgressUrls } from './forum';
export { carryOverPreviewPageWalkthroughs, previewPageWalkthroughs } from './staff/walkthrough';
