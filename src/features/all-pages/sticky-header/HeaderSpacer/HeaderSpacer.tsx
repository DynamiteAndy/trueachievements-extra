import { intersectionObserver } from '@ta-x-page';
import { useEffect, useRef } from 'preact/hooks';

interface HeaderSpacerProps {
  // The header's height, which the sticky header follows
  height: number;
  // The header's background: while the header is out of view at the top of the page, its place shows as the header's
  // bar rather than an empty gap
  background: string;
  // Whether the page is at its top: the spacer (where the header was) is on screen
  onAtTopChange: (atTop: boolean) => void;
}

// Holds the header's place in the page once it's fixed, so the page doesn't jump up under it, at the header's height
// (e.g. when the site's header wraps), and whether it's on screen tells the sticky header the page is at its top.
export const HeaderSpacer = ({ height, background, onAtTopChange }: HeaderSpacerProps) => {
  const spacer = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      spacer.current
        ? intersectionObserver.observe(spacer.current, (entry) => onAtTopChange(entry.isIntersecting))
        : undefined,
    [onAtTopChange]
  );

  return <div ref={spacer} style={{ height: `${height}px`, backgroundColor: background }} />;
};
