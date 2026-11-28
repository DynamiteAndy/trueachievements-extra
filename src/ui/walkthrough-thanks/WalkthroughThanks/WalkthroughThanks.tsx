export interface WalkthroughThanksProps {
  count: string;
  // The thumbs up; the site's own unless a walkthrough page gives another
  src?: string;
}

// The site's thanks block from a walkthrough's side column: the count, with its thumbs up. Show owner progress shows it
// as it is; the walkthrough preview puts it in its Walkthrough Thanks section.
export const WalkthroughThanks = ({ count, src = '/images/walkthroughs/thumbs_up.png' }: WalkthroughThanksProps) => (
  <div class="thanks">
    <span>{count}</span>
    <img class="thumbsup" src={src} alt="Thanks" width={64} height={64} />
  </div>
);
