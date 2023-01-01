const tsconfig = require('./tsconfig.json');
const fs = require('fs');
const path = require('path');

const ASTERISK = /\*/g;
const LEADING_DOT_SLASH = /^\.\//;
const CARET = /\^/g;

const { compilerOptions: { paths, baseUrl } } = tsconfig;

function formatTSConfig () {
  let formatted = {};

  for (let key in paths) {
    const from = key
      .replace(CARET, '\\^')
      .replace(ASTERISK, '(.+)');

    let index = 0;

    const to = path.join(__dirname, baseUrl, paths[key][0]
      .replace(LEADING_DOT_SLASH, '')
      .replace(ASTERISK, () => {
        return `$${index += 1}`;
      }));

    formatted[from] = (alias, regexMatch, regexObject) => {
      let result = alias.replace(regexObject, to);

      if (fs.existsSync(result) && fs.lstatSync(result).isDirectory()) {
        result = path.join(result, 'index');
      }

      if (fs.existsSync(result)) {
        return result;
      }

      if (fs.existsSync(result + '.ts')) {
        return result + '.ts';
      }

      if (fs.existsSync(result + '.tsx')) {
        return result + '.tsx';
      }

      return result;
    };
  }

  return formatted;
}

const replacements = formatTSConfig();

const aliasifyConfig = {
  configDir: __dirname,
  replacements,
  appliesTo: {
    includeExtensions: [
      '.ts',
      '.tsx'
    ]
  },
  verbose: false
};

module.exports = aliasifyConfig;