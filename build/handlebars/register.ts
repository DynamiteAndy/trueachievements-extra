import { includes, markdown, changelog } from './includes';
import { parseProperty } from './json';

export default function register (): void {
  changelog();
  markdown();
  includes();
  parseProperty();
}