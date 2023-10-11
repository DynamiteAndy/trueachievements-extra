require('ts-node/register/transpile-only');

module.exports = {
  process: (_src, filename) => {
    const fs = require('fs-extra');
    const minify = require('@minify-html/node').minify;
    const Handlebars = require('../../build/handlebars').default;

    const minifyHtmlConfig = {
      do_not_minify_doctype: false,
      ensure_spec_compliant_unquoted_attribute_values: false,
      keep_closing_tags: true,
      keep_html_and_head_opening_tags: false,
      keep_spaces_between_attributes: false,
      keep_comments: false,
      minify_css: true,
      minify_js: true,
      remove_bangs: true,
      remove_processing_instructions: true
    };

    const htmlContent = fs.readFileSync(filename, 'utf8');
    let result = Handlebars.compile(htmlContent)({});
    result = minify(Buffer.from(result), minifyHtmlConfig).toString();

    return { code: 'module.exports = ' + JSON.stringify(result) + ';' };
  }
};
