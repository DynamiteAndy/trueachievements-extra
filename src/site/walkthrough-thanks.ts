// A walkthrough's thanks, as its public page's side column shows them: the count, and the thumbs up's picture. Null
// when the page has no thanks block
interface WalkthroughThanksRead {
  count: string;
  src: string;
}

export const readWalkthroughThanks = (walkthroughPage: Document): WalkthroughThanksRead | null => {
  const thanks = walkthroughPage.querySelector('.walkthroughthanks .thanks');

  return thanks
    ? {
        count: thanks.querySelector('span')?.textContent.trim() ?? '',
        src: thanks.querySelector('img')?.getAttribute('src') ?? ''
      }
    : null;
};
