import { NewsRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import sales from './sales';

import news from '.';

describeEntry('news', {
  run: news,
  page: () => vi.spyOn(NewsRegex.Test, 'newsUrl'),
  batch: 'News',
  tasks: [{ name: 'news:sales', task: sales }]
});
