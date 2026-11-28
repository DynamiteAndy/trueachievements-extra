import { allConcurrently } from '@ta-x-lib';
import { NewsRegex } from '@ta-x-site';

import sales from './sales';

// Its tab in the settings menu (features/settings-tabs.tsx)
export { NewsSettings } from './NewsSettings';

export default async (): Promise<void> => {
  if (!NewsRegex.Test.newsUrl()) {
    return;
  }

  await allConcurrently('News', [{ name: 'news:sales', task: sales }]);
};
