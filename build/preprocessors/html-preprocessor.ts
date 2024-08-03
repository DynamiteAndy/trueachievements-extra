import { extname } from 'path';
import { minify } from '@minify-html/node';
import Handlebars from '../handlebars';

export default function (content: string, loaderContext) {
  try {
    let result: string = null;
    const minifyOpts = {
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

    if (extname(loaderContext.resourcePath) === '.hbs') {
      const compiledHtml = Handlebars.compile(content)({});
      result = minify(Buffer.from(compiledHtml), minifyOpts).toString();
    } else {
      result = minify(Buffer.from(content), minifyOpts).toString();
    }

    return result;
  } catch (error) {
    loaderContext.emitError(error);

    return content;
  }
}
