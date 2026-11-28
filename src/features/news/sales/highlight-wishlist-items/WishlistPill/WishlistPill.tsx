import { classNames } from '@ta-x-lib';

import styles from '../styles';

export interface WishlistPillProps {
  // A wishlisted game or DLC itself, or a product containing one (an edition, a bundle, a pass)
  kind: 'item' | 'containing';
}

// The label after a sale row's name, like the wishlist page's own listing pills. Its words come from our stylesheet:
// the site's table sort reads the name cell's text, so words in the page would change where the row sorts
export const WishlistPill = ({ kind }: WishlistPillProps) => (
  <span
    class={classNames(styles.wishlistPill, kind === 'item' ? styles.wishlistItem : styles.containingWishlistItem)}
  />
);
