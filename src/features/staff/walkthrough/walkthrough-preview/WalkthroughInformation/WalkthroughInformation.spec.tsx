import { find, renderElement, required } from '@ta-x-test';
import { AskLoaderStyles } from '@ta-x-ui';

import styles from '../styles';

import { WalkthroughInformation } from './WalkthroughInformation';

describe('staff/walkthrough/walkthrough-preview/WalkthroughInformation', () => {
  test("renders a purple section with the feature's style class, its ask loader asking for the walkthrough id", () => {
    const section = renderElement(<WalkthroughInformation onSave={async () => undefined} />);

    expect([...section.classList]).toEqual(['purple', styles.populateAsideContent]);
    expect([...find(':scope > article', section).children].map((child) => child.className)).toEqual([
      `${AskLoaderStyles.askLoaderContainer}`
    ]);
    expect(required(section.firstElementChild).textContent).toBe('Walkthrough Information');
    expect(find('label', section).textContent).toBe('Walkthrough Id');
    expect(find(`.${AskLoaderStyles.askLoaderAsk} p`, section).textContent).toBe(
      'Can\'t automate them all sadly! Please enter the walkthrough id to link this page to the walkthrough, I\'ll try remember it next time! This works for "In progress", "Ready for review", "Ready for publish" and "Published" walkthroughs.'
    );
  });

  test("says the walkthrough couldn't be found when asking again after an id typed in wasn't", () => {
    const section = renderElement(<WalkthroughInformation notFound onSave={async () => undefined} />);

    expect(find(`.${AskLoaderStyles.askLoaderAsk} p`, section).textContent).toBe(
      'That walkthrough couldn\'t be found. Please check its id and try again. This works for "In progress", "Ready for review", "Ready for publish" and "Published" walkthroughs.'
    );
  });
});
