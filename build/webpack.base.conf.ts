import { resolve } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import Handlebars from 'handlebars';
import register from './handlebars/register';

register();

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
          minimize: process.env.webpack_minimize ? true : false,
          preprocessor: (content, loaderContext) => {
            let result: string;

            try {
              result = Handlebars.compile(content)({});
            } catch (error) {
              loaderContext.emitError(error);

              return content;
            }

            return result;
          }
        }
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: process.env.webpack_minimize ? true : false
        }
      },
      {
        test: /\.m?ts$/,
        use: {
          loader: 'ts-loader'
        }
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