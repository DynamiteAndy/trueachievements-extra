import { addClasses } from '@ta-x-page';
import { useLayoutEffect } from 'preact/hooks';

import styles from '../styles';

interface HoverableParagraphsProps {
  // The site's walkthrough page text
  page: HTMLElement;
}

// A controller for the site's walkthrough page text: while mounted, it's marked for its paragraphs to highlight on
// hover; unmounted, the mark comes off. It renders nothing of its own
export const HoverableParagraphs = ({ page }: HoverableParagraphsProps) => {
  useLayoutEffect(() => addClasses(page, styles.hoverableParagraphs), [page]);

  return null;
};
