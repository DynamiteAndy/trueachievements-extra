import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { default as UserScriptMetaDataPlugin } from 'userscript-metadata-webpack-plugin';
import { default as LiveReloadPlugin } from 'webpack-livereload-plugin';
import { baseConfig } from './webpack.base.conf';
import metadata from './metadata';

metadata.name[''] += ' - Development';
metadata.require.push(
  'file://' + resolve(__dirname, '../dist/trueachievements-extras.debug.js')
);

delete metadata.downloadURL;
delete metadata.updateURL;

export const devConfig = merge(baseConfig as any, {
  mode: 'development',
  cache: {
    type: 'filesystem',
    name: 'dev'
  },
  entry: {
    debug: baseConfig.entry,
    'dev.user': resolve(__dirname, './empty.ts')
  },
  output: {
    filename: 'trueachievements-extras.[name].js',
    path: resolve(__dirname, '../dist')
  },
  devtool: 'eval-source-map',
  watch: process.env.webpack_watch ? true : false,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new LiveReloadPlugin({
      delay: 500
    }),
    new UserScriptMetaDataPlugin({
      metadata
    })
  ]
});

export default devConfig;