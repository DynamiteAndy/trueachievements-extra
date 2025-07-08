import { join } from 'node:path';
import { merge } from 'rspack-merge';
import ExternalFileWatcherPlugin from './plugins/external-file-watcher-plugin';
import { baseConfig, createMetadataPlugin, entryPath } from './rspack.base.conf';
import metadata from './metadata';

(metadata.name as { $: string }).$ += ' - Development';
(metadata.require as string[]).push(`file://${join(__dirname, '../dist/trueachievements-extras.debug.js')}`);

metadata.downloadURL = undefined;
metadata.updateURL = undefined;

export const devConfig = merge(baseConfig, {
  mode: 'development',
  cache: false,
  entry: {
    debug: entryPath,
    'dev.user': join(__dirname, './empty.ts')
  },
  output: {
    filename: 'trueachievements-extras.[name].js'
  },
  devtool: process.env.analyse ? 'cheap-module-source-map' : 'eval-cheap-module-source-map',
  watch: !!process.env.watch,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: process.env.watch
    ? [
        createMetadataPlugin(metadata),
        new ExternalFileWatcherPlugin({
          files: [
            join(__dirname, '../src/**/*.hbs'),
            join(__dirname, '../CHANGELOG.md'),
            join(__dirname, '../CREDITS.md'),
            join(__dirname, '../FEATURE-DOCUMENTATION.md')
          ]
        })
      ]
    : [createMetadataPlugin(metadata)]
});

export default devConfig;
