import { conditional, ternary } from './conditions';
import { includes, markdown, changelog } from './includes';
import { parseProperty } from './json';
import { createArray, createObject, createString } from './create';

export default function register(): void {
  changelog();
  markdown();
  includes();
  parseProperty();
  createObject();
  createArray();
  createString();
  conditional();
  ternary();
}
