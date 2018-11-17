


let config = require('./config.js').dev;
let styleLoaders = require('./utils.js').styleLoaders;
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.js');
const utils = require('./utils.js');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin.js');

const devWebpackConfig = {
  mode: 'development',
  stats: false,
  entry: utils.getEntries('./website', 'app.js', true),
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: '[name]/static/js/[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: styleLoaders({ sourceMap: config.cssSourceMap, usePostCSS: true }).concat([
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
        }
      }
    ])
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.devtool,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.defineEnv
    }),
    new SpriteLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new VueLoaderPlugin(),
    new WebpackBar()
  ]
};
let htmlConfig = utils.setMultipagePlugin('./website', 'index.html')
module.exports = webpackMerge(webpackBaseConfig, htmlConfig, devWebpackConfig);