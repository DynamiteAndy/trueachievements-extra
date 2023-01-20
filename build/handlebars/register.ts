import { includes, markdown, changelog, credits } from './includes';
import { parseProperty } from './json';

export default function register (): void {
  changelog();
  credits();
  markdown();
  includes();
  parseProperty();
}