import type { Configuration } from '@rspack/core';
import { merge } from 'rspack-merge';
import { baseConfig, createMetadataPlugin } from './rspack.base.conf';
import metadata from './metadata';

const filename = process.env.minimize ? 'trueachievements-extras.min.user.js' : 'trueachievements-extras.user.js';

metadata.updateURL += filename;
metadata.downloadURL += filename;

export const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: filename
  },
  optimization: {
    minimize: !!process.env.minimize
  },
  devtool: false,
  cache: false,
  plugins: [createMetadataPlugin(metadata)]
});

export default prodConfig;
