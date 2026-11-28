import { hideRow } from '@ta-x-ui';

// Hides a sale row (given the row or a cell in it) for one of the hide features. They share the prefix, so hideRow
// merges their reasons on a row both hide ("Hide Owned Items and Unobtainable Items"). Returns what gives it back
export const hideSaleRow = (element: HTMLElement, hiddenBy: string): (() => void) =>
  hideRow({ element, method: 'table', prefix: 'Hide', hiddenBy });
