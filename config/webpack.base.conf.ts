import { resolve } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

export const baseConfig = {
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [new TsconfigPathsPlugin()]
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
        test: /\.html$/,
        type: 'asset/source'
      },
      {
        test: /\.m?ts$/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.s?[ac]ss$/i,
        exclude: /tinymce[\\|/].*[\\|/]content\.s?[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /tinymce[\\|/].*[\\|/]content\.s?[ac]ss$/i,
        use: ['sass-to-string', 'sass-loader']
      }
    ]
  },
  plugins: process.env.webpack_analyse ? [new BundleAnalyzerPlugin()] : []
};