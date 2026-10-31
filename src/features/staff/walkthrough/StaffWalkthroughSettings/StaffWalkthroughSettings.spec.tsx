import { getAccordions, mountInPage } from '@ta-x-test';
import { AccordionStyles } from '@ta-x-ui';

import { StaffWalkthroughSettings } from './StaffWalkthroughSettings';

describe('StaffWalkthroughSettings', () => {
  test('should render each page as an accordion, in order, with its content after its header', () => {
    expect(getAccordions(<StaffWalkthroughSettings />)).toEqual([
      'Edit Walkthrough',
      'Manage Walkthrough',
      'Walkthrough Page',
      'Walkthrough Preview'
    ]);
  });

  // The site's own class for a settings list, which lays out the rows
  test("should lay each page's settings out as the site's settings", () => {
    const { container } = mountInPage(<StaffWalkthroughSettings />);
    const contents = [...container.querySelectorAll('.ta-x-accordion-content')];

    expect(contents).toHaveLength(4);
    contents.forEach((content) => expect(content).toHaveExactClasses([AccordionStyles.accordionContent, 't-settings']));
  });
});
