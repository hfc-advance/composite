
const fs = require('fs');
const path = require('path');
const getLessVariables = require('./get-less-variables.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageConfig = require('../package.json');
//? 获取编译入口文件
let getEntries = (pageDir, entryPath, isDev) => {
  //! 编译模块
  let moduleArray = process.argv.slice(2);
  //! 是否需要单独编译某个项目
  let hasModule = moduleArray.length > 0 && moduleArray[0] !== '--config';
  let pageDirPath = path.join(__dirname, '..', pageDir);
  let entry = {};
  fs.readdirSync(pageDirPath)
    // 发现文件夹，就认为是页面模块
    .filter((f) => {
      let isDirectory = fs.statSync(path.join(pageDirPath, f)).isDirectory();
      //! 增量编译
      if (hasModule && moduleArray) return moduleArray.indexOf(f) > -1 && isDirectory;
      //! 全部编译
      return isDirectory;
    })
    .forEach((f) => {
      let _path = [pageDir, f, entryPath].join('/')
      entry[path.basename(f)] = isDev ? [_path].concat(['webpack/hot/dev-server', 'webpack-hot-middleware/client']) : _path
    });
    // return Object.keys(entry).map(key => entry[key]);
    return entry;
};

exports.getEntries = getEntries;
//? 基础css-loader
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    return [].concat(options.extract ? MiniCssExtractPlugin.loader : 'vue-style-loader').concat(loaders)
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', {
      globalVars: getLessVariables(path.join(__dirname, '../components/styles/vars.less'))
    }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass').concat({
      loader: 'sass-resources-loader',
      options: {
        resources: [path.join(__dirname, '../components/styles/vars.scss')]
      }
    }),
    stylus: generateLoaders('stylus', {
      import: path.join(__dirname, '../components/styles/vars.styl')
    }),
    styl: generateLoaders('stylus', {
      import: path.join(__dirname, '../components/styles/vars.styl')
    })
  }
}

//? 生成css-loader
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

//? 编译出错提示

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.jpg')
    })
  }
}

//? 编译html
exports.setMultipagePlugin = function (pageDir, entryPath, htmlOptions) {
  const pages = getEntries(pageDir, entryPath)
  let webpackConfig = { plugins: [] }
  const getWebpackConfig = function (pathname) {
    const opt = Object.assign({}, {
      filename: pathname + '/index.html',
      template: pages[pathname],
      chunks: [pathname],
      inject: true,
      favicon: path.resolve(__dirname, '../favicon.ico')
    }, htmlOptions);
    return new HtmlWebpackPlugin(opt)
  }
  webpackConfig.plugins = Object.keys(pages).map(pathname => getWebpackConfig(pathname))
  return webpackConfig
}