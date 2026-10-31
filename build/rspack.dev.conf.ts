import { rspack } from '@rspack/core';
import { merge } from 'rspack-merge';

import type { Configuration, RspackPluginInstance } from '@rspack/core';

import { createMetadata, header } from './metadata.ts';
import { baseConfig, entryPath } from './rspack.base.conf.ts';

// The script Tampermonkey installs is the header alone: its @require loads the debug build
const devUserscriptPlugin: RspackPluginInstance = {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('DevUserscript', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'DevUserscript', stage: rspack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        () => {
          compilation.emitAsset(
            'trueachievements-extras.dev.user.js',
            new rspack.sources.RawSource(`${header(createMetadata('dev'))}\n`)
          );
        }
      );
    });
  }
};

export default (): Configuration =>
  merge(baseConfig, {
    mode: 'development',
    entry: {
      // Preact's debug warnings and DevTools, the signal log, and debug logging, ahead of the script so they see every
      // render and every signal
      debug: [
        './src/dev/start-mark.ts',
        './src/dev/devtools-hook.ts',
        './src/dev/preact-debug.ts',
        './src/dev/signals-debug.ts',
        './src/dev/debug-logging.ts',
        entryPath
      ]
    },
    output: {
      filename: 'trueachievements-extras.[name].js'
    },
    devtool: 'eval-cheap-module-source-map',
    watchOptions: {
      ignored: /node_modules/
    },
    plugins: [devUserscriptPlugin]
  });
