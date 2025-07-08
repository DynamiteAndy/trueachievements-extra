import minifyHtml from '@minify-html/node';
import { compileString } from 'sass';
import Handlebars from '../../build/handlebars/index.ts';
import { MINIFY_OPTS } from '../../build/loaders/html-loader.ts';

export default () => {
  const hbsRegex = /\.hbs$/;
  const htmlRegex = /\.html$/;
  const scssRegex = /\.scss$/;

  const compileSass = (src: string): string => {
    const result = compileString(src);
    return result.css;
  };

  const compileHandlebars = (src: string): string => {
    const result = Handlebars.compile(src)({});
    return result;
  };

  const minifyContent = (src: string): string => {
    const result = minifyHtml.minify(Buffer.from(src), MINIFY_OPTS).toString();
    return result;
  };

  return {
    name: 'vitest-web',

    transform(code: string, id: string) {
      let result: string | null = null;

      if (hbsRegex.test(id)) {
        const content = compileHandlebars(code);
        result = minifyContent(content);
      } else if (htmlRegex.test(id)) {
        result = minifyContent(code);
      } else if (scssRegex.test(id)) {
        result = compileSass(code);
      }

      if (result !== null) {
        return {
          code: `module.exports = ${JSON.stringify(result)};`
        };
      }
    }
  };
};
