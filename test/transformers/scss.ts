module.exports = {
  process: (_src, filename) => {
    const fs = require('fs-extra');
    const sass = require('sass');

    const sassContent = fs.readFileSync(filename, 'utf8');
    const result = sass.compileString(sassContent);

    return { code: 'module.exports = ' + JSON.stringify(result.css) + ';' };
  }
};
