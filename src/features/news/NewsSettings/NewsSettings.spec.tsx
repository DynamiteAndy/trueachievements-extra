import { getAccordions } from '@ta-x-test';

import { NewsSettings } from './NewsSettings';

describe('NewsSettings', () => {
  // The sales rows are SalesSettings' (its spec checks them)
  test('should render the sales settings', () => {
    expect(getAccordions(<NewsSettings />)).toEqual(['Sales']);
  });
});
