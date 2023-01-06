import { join } from 'path';
import { compilerOptions } from '../../tsconfig.json';

const ASTERISK = /\*/g;
const LEADING_DOT_SLASH = /^\.\//;
const ENDING_SLASH = /\/$/;
const { baseUrl, paths } = compilerOptions;
let aliases = null;

export default (aliasPath: string, parentPartialDirectory?: string): string => {
  const filePath = aliasPath.split('/');
  const alias = filePath.shift();

  if (aliases === null) {
    aliases = {};

    for (const key in paths) {
      const from = key
        .replace(ASTERISK, '')
        .replace(ENDING_SLASH, '');
  
      const to = join(process.cwd(), baseUrl, paths[key][0]
        .replace(LEADING_DOT_SLASH, '')
        .replace(ASTERISK, '')
        .replace(/index$/, ''));
  
      aliases[from] = to;
    }
  }

  return aliases[alias]
    ? join(aliases[alias], filePath.join('/'))
    : join(parentPartialDirectory || '', aliasPath);
};