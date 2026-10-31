import { callAll } from '@ta-x-lib';

import hideOwnedItems from './owned-items';
import hideUnobtainableItems from './unobtainable-items';

// sales/index.ts starts it once the tables are parsed. Both apply live, so both start whatever their settings, each
// hiding while its own is on (it subscribes to nothing else). Returns the stop for both
export default (): (() => void) => {
  const stops = [hideOwnedItems(), hideUnobtainableItems()];

  return () => callAll(stops);
};
