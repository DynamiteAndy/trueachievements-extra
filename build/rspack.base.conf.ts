import { join } from 'node:path';

import { defineConfig } from '@rspack/cli';

const loaderDirectory = join(import.meta.dirname, 'loaders');

export const entryPath = './src/index.ts';
export const baseConfig = defineConfig({
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    tsConfig: {
      configFile: join(import.meta.dirname, '../tsconfig.json')
    }
  },
  entry: entryPath,
  output: {
    path: join(import.meta.dirname, '../dist'),
    // A userscript is one file: a dynamic import stays in the bundle, run when it's first imported
    asyncChunks: false
  },
  // A modern ECMAScript target (Tampermonkey runs in current Chrome and Firefox): rspack sets swc's jsc.target and the
  // minimizer's ecma from it, so async functions, arrows and classes stay as written and emojis stay UTF-8 instead of
  // escape pairs. Plain 'web' gives neither, and swc then compiles down to old ECMAScript (much bigger once minified)
  target: ['web', 'es2024'],
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/i,
        // The compiled CSS as the module's default export, a string
        type: 'asset/source',
        use: [
          {
            loader: 'builtin:lightningcss-loader',
            options: {
              minify: true
            }
          },
          {
            loader: 'sass-loader',
            // So a stylesheet anywhere can `@use 'variables'` without counting folders
            options: { sassOptions: { loadPaths: [join(import.meta.dirname, '../src/scss')] } }
          }
        ]
      },
      {
        test: /\.json$/,
        include: /node_modules[\\/]emoji\.json/,
        type: 'javascript/auto',
        loader: join(loaderDirectory, 'emoji-loader.ts')
      },
      {
        test: /\.md$/i,
        type: 'javascript/auto',
        loader: join(loaderDirectory, 'markdown-loader.ts')
      },
      // TypeScript through swc, parsed as TSX only for .tsx (generic arrows in .ts would break), with Preact's JSX
      {
        test: /\.m?tsx?$/,
        exclude: [/node_modules/],
        type: 'javascript/auto',
        loader: 'builtin:swc-loader',
        options: {
          detectSyntax: 'auto',
          jsc: { transform: { react: { runtime: 'automatic', importSource: 'preact' } } }
        }
      }
    ]
  }
});
