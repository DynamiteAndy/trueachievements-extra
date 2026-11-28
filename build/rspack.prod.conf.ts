import { join } from 'node:path';

import { rspack } from '@rspack/core';
import { merge } from 'rspack-merge';

import type { Compiler, Configuration } from '@rspack/core';

import { createMetadata, header, scriptFilename } from './metadata.ts';
import { baseConfig } from './rspack.base.conf.ts';

import type { UserscriptMetadata } from './metadata.ts';

// The userscript header on each .user.js, added after minifying so it survives it
const createMetadataPlugin = (metadata: UserscriptMetadata): InstanceType<typeof rspack.BannerPlugin> =>
  new rspack.BannerPlugin({
    banner: `${header(metadata)}\n`,
    raw: true,
    test: /\.user\.js$/,
    stage: rspack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
  });

// Packages' `//# sourceMappingURL=` comments, kept in the readable script, name maps we don't ship
const stripSourceMapCommentsPlugin = {
  apply: (compiler: Compiler): void => {
    compiler.hooks.thisCompilation.tap('StripSourceMapComments', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'StripSourceMapComments', stage: rspack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE },
        (assets) => {
          for (const name of Object.keys(assets).filter((asset) => asset.endsWith('.user.js'))) {
            const source = assets[name].source().toString();
            const stripped = source.replace(/\/\/# sourceMappingURL=\S+/g, '');
            if (stripped !== source) {
              compilation.updateAsset(name, new rspack.sources.RawSource(stripped));
            }
          }
        }
      );
    });
  }
};

const prodConfig = (variant: 'prod' | 'prod-min', release: boolean): Configuration => {
  const minimize = variant === 'prod-min';

  return merge(baseConfig, {
    name: variant,
    mode: 'production',
    output: {
      // Only build:release (run by CI) writes the tracked release scripts in dist/; local prod builds go to dist/local/
      path: join(import.meta.dirname, release ? '../dist' : '../dist/local'),
      filename: scriptFilename(variant)
    },
    optimization: {
      minimize,
      // Short numeric module ids in the minified script; the readable one (and dev builds) keep full paths
      moduleIds: minimize ? 'deterministic' : 'named',
      // Keeps @license comments (jscolor's GPLv3 notice) inline: swc's default drops every comment
      minimizer: [new rspack.SwcJsMinimizerRspackPlugin({ minimizerOptions: { format: { comments: 'some' } } })]
    },
    // Size hints are for pages loading over a network; Tampermonkey runs the script from storage
    performance: { hints: false },
    plugins: [stripSourceMapCommentsPlugin, createMetadataPlugin(createMetadata(variant))]
  });
};

// `--env analyse` (pnpm run analyse) adds Rsdoctor to the minified script, what users install, loaded only then.
// Rsdoctor sizes each module by finding it in the minified output, which it can't do for modules concatenated into
// one scope, so this build leaves them apart: a little bigger than what ships, the same code otherwise. No source
// map: with one, Rsdoctor sizes almost nothing. Written to its own folder, so dist/local keeps the script that ships
const analyseConfig = async (): Promise<Configuration> => ({
  output: { path: join(import.meta.dirname, '../dist/local/analyse') },
  optimization: { concatenateModules: false },
  plugins: [
    new (await import('@rsdoctor/core')).RsdoctorRspackPlugin({
      // A fixed port for its local server, so its address (and the port to free once it's stopped) is always the same
      server: { port: 9988 },
      linter: {
        rules: {
          'ecma-version-check': 'off'
        }
      }
    })
  ]
});

// Both scripts in one process; `--config-name prod` or `prod-min` builds one, `--env release` writes them to dist/
export default async ({ release = false, analyse = false }: { release?: boolean; analyse?: boolean } = {}): Promise<
  Configuration[]
> => [
  prodConfig('prod', release),
  analyse ? merge(prodConfig('prod-min', release), await analyseConfig()) : prodConfig('prod-min', release)
];
