import { find, renderElement, required } from '@ta-x-test';
import { AskLoaderStyles } from '@ta-x-ui';

import styles from '../styles';

import { ShowOwnerProgress } from './ShowOwnerProgress';

describe('forum/view-thread/show-owner-progress/ShowOwnerProgress', () => {
  test("renders a purple section with the feature's style class and title, its ask loader in its body", () => {
    const section = renderElement(<ShowOwnerProgress onSave={async () => false} />);

    expect(section.tagName).toBe('SECTION');
    expect([...section.classList]).toEqual(['purple', styles.showOwnerProgress]);
    find(`:scope > article > .${AskLoaderStyles.askLoaderContainer}`, section);
    expect(required(section.firstElementChild).textContent).toBe('Walkthrough Information');
    expect(find('label', section).textContent).toBe('Walkthrough Url');
    expect(find(`.${AskLoaderStyles.askLoaderAsk} p`, section).textContent).toBe(
      "Can't automate them all sadly! Please enter a direct link to the walkthrough page to link this thread to the walkthrough, I'll remember it next time!"
    );
    expect(find('label', section).getAttribute('for')).toBe(find('input[type="text"]', section).id);
  });
});
