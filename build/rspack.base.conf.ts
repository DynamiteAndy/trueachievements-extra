import { resolve } from 'path';
import { defineConfig } from '@rspack/cli';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import htmlPreprocessor from './preprocessors/html-preprocessor';

export const baseConfig = defineConfig({
  resolve: {
    extensions: ['.js', '.ts'],
    tsConfig: {
      configFile: resolve(__dirname, '../tsconfig.json')
    }
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
        test: /\.html$|\.hbs$/i,
        loader: 'html-loader',
        options: {
          sources: false,
          preprocessor: htmlPreprocessor
        }
      },
      {
        test: /\.m?ts$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'ES2020'
            }
          }
        ]
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          {
            loader: resolve(__dirname, './loaders/sass-to-string-loader.ts')
          },
          'sass-loader'
        ]
      },
      {
        test: require.resolve('emoji.json'),
        use: [
          {
            loader: resolve(__dirname, './loaders/emoji-loader.ts'),
            options: {
              compress: true
            }
          }
        ]
      }
    ]
  },
  plugins: process.env.analyse ? [new RsdoctorRspackPlugin()] : []
});
