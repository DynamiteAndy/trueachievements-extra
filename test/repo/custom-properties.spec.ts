import { stickyHeaderHeight, stickyUnderHeaderStyles } from '@ta-x-page';
import css from '@ta-x-scss/index.scss';

import stickyHeaderStyles from '../../src/features/all-pages/sticky-header/styles';
import editWalkthroughStyles from '../../src/features/staff/walkthrough/edit-walkthrough-page/styles';

// The CSS custom properties our code sets are named in TypeScript and read in SCSS. A rename on one side only would
// leave the other reading nothing, so each name the code sets must be in the compiled sheet
describe('CSS custom properties', () => {
  test.each([
    stickyHeaderHeight,
    ...Object.values(stickyUnderHeaderStyles.variables),
    ...Object.values(stickyHeaderStyles.variables),
    ...Object.values(editWalkthroughStyles.variables)
  ])('%s, set by our code, is read by the stylesheet', (property) => {
    expect(css).toContain(`var(${property}`);
  });
});
