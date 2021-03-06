const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const { prod_Path, src_Path } = require('./path')
const { selectedPreprocessor } = require('./loader')

module.exports = {
  entry: {
    main: './' + src_Path + '/index.js',
  },
  output: {
    path: path.resolve(__dirname, prod_Path),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: selectedPreprocessor.fileRegexp,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: selectedPreprocessor.loaderName,
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|txt)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, prod_Path), {
      root: process.cwd(),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './' + src_Path + '/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: './' + src_Path + '/image/',
        to: path.resolve(__dirname, prod_Path) + '/image/',
      },
    ]),
    new OptimizeCssAssetsPlugin({}),
    new WebpackMd5Hash(),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
}
