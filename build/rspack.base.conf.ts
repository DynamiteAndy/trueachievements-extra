import { join } from 'node:path';
import { defineConfig } from '@rspack/cli';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { Metadata, UserScriptMetaDataPlugin } from 'userscript-metadata-webpack-plugin';

const loaderDirectory = join(__dirname, './loaders');

export const createMetadataPlugin = (metadata: Metadata): UserScriptMetaDataPlugin =>
  new UserScriptMetaDataPlugin({ metadata });

export const entryPath = './src/index.ts';
export const baseConfig = defineConfig({
  resolve: {
    extensions: ['.js', '.ts'],
    tsConfig: {
      configFile: join(__dirname, '../tsconfig.app.json')
    }
  },
  optimization: {
    minimize: false,
    moduleIds: 'named'
  },
  entry: entryPath,
  output: {
    path: join(__dirname, '../dist')
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/i,
        use: [
          {
            loader: join(loaderDirectory, 'sass-to-string-loader.ts')
          },
          {
            loader: 'builtin:lightningcss-loader',
            options: {
              minify: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.json$/,
        include: /node_modules[\\/]emoji\.json/,
        type: 'javascript/auto',
        use: [
          {
            loader: join(loaderDirectory, 'emoji-loader.ts'),
            options: { compress: true }
          }
        ]
      },
      {
        test: /\.html$|\.hbs$/i,
        type: 'javascript/auto',
        loader: join(loaderDirectory, 'html-loader.ts')
      },
      {
        test: /\.m?ts$/,
        exclude: [/node_modules/],
        type: 'javascript/auto',
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript'
                }
              }
            }
          },
          {
            loader: join(loaderDirectory, 'inline-javascript-loader.ts'),
            options: {
              compress: true,
              includedPaths: [/staff-walkthrough-improvements[/\\]edit-walkthrough[/\\]tinymce[/\\].*\.ts$/]
            }
          }
        ]
      }
    ]
  },
  plugins: process.env.analyse
    ? [
        new RsdoctorRspackPlugin({
          linter: {
            rules: {
              'ecma-version-check': 'off'
            }
          }
        })
      ]
    : []
});
