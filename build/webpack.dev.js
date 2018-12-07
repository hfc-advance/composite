


let config = require('./config.js').dev;
let styleLoaders = require('./utils.js').styleLoaders;
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.js');
const utils = require('./utils.js');

const devWebpackConfig = {
  mode: 'development',
  stats: false,
  entry: utils.getEntries('./website', 'app.js', true),
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: '[name]/static/js/[name].js',
    chunkFilename: '[name][hash:6].js',
  },
  module: {
    rules: styleLoaders({ sourceMap: config.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.devtool,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.defineEnv
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new VueLoaderPlugin(),
    new WebpackBar()
  ]
};
let htmlConfig = utils.setMultipagePlugin('./website', 'index.html')
module.exports = webpackMerge(webpackBaseConfig, htmlConfig, devWebpackConfig);