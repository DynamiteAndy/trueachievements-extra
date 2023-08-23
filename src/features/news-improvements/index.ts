import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { Constants, NewsRegex, newsImprovements } from '@ta-x-globals';
import sales from './sales';

export default async (): Promise<void> => {
  if (!newsImprovements.enabled) return;
  if (!NewsRegex.Test.newsUrl()) return;
  if (!(await waitForElement('body'))) return;

  document.body.classList.add(
    Constants.Styles.NewsImprovements.featureJs,
    Constants.Styles.NewsImprovements.featureStyle
  );

  allConcurrently('News Improvements', [{ name: 'news-improvements-sales', task: sales }]);
};
