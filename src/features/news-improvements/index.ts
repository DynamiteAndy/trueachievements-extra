import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { NewsRegex } from '@ta-x-globals';
import sales from './sales';
import styles from './styles';

export default async (): Promise<void> => {
  if (!NewsRegex.Test.newsUrl()) {
    return;
  }

  if (!(await waitForElement('body'))) {
    return;
  }

  document.body.classList.add(styles.jsNewsImprovements, styles.newsImprovements);

  allConcurrently('News Improvements', [{ name: 'news-improvements-sales', task: sales }]);
};
