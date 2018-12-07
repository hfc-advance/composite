
const path = require('path');
const config = require('./config.js');
const utils = require('./utils.js');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin.js');

let resolve = dir => path.resolve(__dirname, dir);
let assetsArray = [resolve('../website'), resolve('../components')];
let relative = (dir) => {
  let tmp = path.dirname(path.relative(path.resolve(__dirname, '../website'), dir));
  let relativeStr = tmp.split(path.sep)[0]
  //? TODO:所有项目公用资源有可能出问题
  return /^../.test(relativeStr) ? '.' : relativeStr;
}

var entry = utils.getEntries('./website');
//? 创建项目别名
let alias = {
  'vue$': 'vue/dist/vue.esm.js',
  //? 组件库的别名
  'components': path.resolve(__dirname, '../components'),
  //? 站点根节点的别名
  '@': path.resolve(__dirname, '../website')
}
//? 每个项目单独的别名
for (let item in entry) {
  alias[item] = path.resolve(process.cwd(), entry[item]);
}
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: assetsArray,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: assetsArray,
        options: {
          cssSourceMap: process.env.NODE_ENV === 'production' ? config.prod.cssSourceMap : config.dev.cssSourceMap,
          cacheBusting: true,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: assetsArray,
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: file => relative(file) + '/static/img/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: file => relative(file) + '/static/media/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: file => relative(file) + '/static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new SpriteLoaderPlugin()
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  stats: config.stats,
  resolve: {
    extensions: ['.js', '.json', '.vue', '.jsx', '.css', '.scss', 'styl', 'sass', 'less'],
    alias
  }
}