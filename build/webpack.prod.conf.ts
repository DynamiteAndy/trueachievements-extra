import { merge } from 'webpack-merge';
import { UserScriptMetaDataPlugin } from 'userscript-metadata-webpack-plugin';
import  TerserPlugin from 'terser-webpack-plugin';
import { baseConfig } from './webpack.base.conf';
import metadata from './metadata';

const filename = process.env.webpack_minimize ? 'trueachievements-extras.min.user.js' : 'trueachievements-extras.user.js';

metadata.updateURL += filename;
metadata.downloadURL += filename;

export const prodConfig = merge(baseConfig as never, {
  mode: 'production',
  output: {
    filename: filename
  },
  optimization: {
    minimize: process.env.webpack_minimize ? true : false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /@.* [\w|\d].*|==\/?UserScript==/i
          },
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  cache: false,
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata
    })
  ]
});

module.exports = prodConfig;