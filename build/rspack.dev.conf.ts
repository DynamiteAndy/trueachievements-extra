import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { UserScriptMetaDataPlugin } from 'userscript-metadata-webpack-plugin';
import { baseConfig } from './rspack.base.conf';
import metadata from './metadata';

metadata.name['$'] += ' - Development';
(metadata.require as string[]).push('file://' + resolve(__dirname, '../dist/trueachievements-extras.debug.js'));

delete metadata.downloadURL;
delete metadata.updateURL;

export const devConfig = merge(baseConfig as never, {
  mode: 'development',
  cache: false,
  entry: {
    debug: baseConfig.entry,
    'dev.user': resolve(__dirname, './empty.ts')
  },
  output: {
    filename: 'trueachievements-extras.[name].js'
  },
  devtool: 'eval-cheap-module-source-map',
  watch: process.env.watch ? true : false,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata
    })
  ]
});

export default devConfig;
