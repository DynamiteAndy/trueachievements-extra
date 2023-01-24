import { resolve } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { minify } from '@minify-html/node';
import Handlebars from 'handlebars';
import register from './handlebars/register';

register();

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

export const baseConfig = {
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [new TsconfigPathsPlugin()]
  },
  optimization: {
    minimize: false,
    moduleIds: 'named'
  },
  entry: './src/index.ts',
  output: {
    path: resolve(__dirname, '../dist')
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.hbs$/i,
        loader: 'html-loader',
        options: {
          sources: false,
          preprocessor: (content: string, loaderContext) => {
            try {
              let result = Handlebars.compile(content)({});
              result = minify(Buffer.from(result), minifyHtmlConfig).toString();

              return result;
            } catch (error) {
              loaderContext.emitError(error);

              return content;
            }
          }
        }
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false,
          preprocessor: (content: string) => {
            const result = minify(Buffer.from(content), minifyHtmlConfig).toString();

            return result;
          }
        }
      },
      {
        test: /\.m?ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.s?[ac]ss$/i,
        use: ['sass-to-string', 'sass-loader']
      }
    ]
  },
  plugins: process.env.webpack_analyse
    ? [
        new BundleAnalyzerPlugin(),
        new StatoscopeWebpackPlugin()
      ]
    : []
};