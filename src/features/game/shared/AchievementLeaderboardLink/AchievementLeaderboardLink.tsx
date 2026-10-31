import { useLayoutEffect, useRef } from 'preact/hooks';

interface AchievementLeaderboardLinkProps {
  // The site's progress bar for the achievement (its tracked gamers)
  progress: HTMLElement;
  // The achievement's leaderboard (its gamers page)
  href: string;
  // The achievement's name, for the link's own
  achievement: string;
}

// Puts a copy of the bar's contents in the link; the site's own nodes stay in its bar
const copyContents = (link: HTMLAnchorElement, progress: HTMLElement): (() => void) => {
  link.replaceChildren(...[...progress.childNodes].map((node) => node.cloneNode(true)));

  return () => link.replaceChildren();
};

// The site's progress bar as a link to the achievement's leaderboard: the bar's own attributes and a copy of its
// contents in an <a>. It's shown from tablet width up and the site's bar below that
// (add-achievement-leaderboard-link.scss), so it copies the bar as it is when rendered. The bar has no text, so the
// link is named for a screen reader: the site's own leaderboard link's title, with the achievement and the bar's figures
export const AchievementLeaderboardLink = ({ progress, href, achievement }: AchievementLeaderboardLinkProps) => {
  const link = useRef<HTMLAnchorElement>(null);
  const attributes = Object.fromEntries([...progress.attributes].map(({ name, value }) => [name, value]));

  useLayoutEffect(() => (link.current ? copyContents(link.current, progress) : undefined), [progress]);

  const name = [`Gamers with ${achievement}`, progress.dataset.af].filter(Boolean).join(', ');

  return <a {...attributes} ref={link} href={href} aria-label={name} />;
};
