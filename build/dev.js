//? 开发环境编译配置
const app = require('express')();
const ora = require('ora');
const portfinder = require('portfinder');
const chalk = require('chalk');
const webpackDevMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const utils = require('./utils.js');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.js');
const del = require('del');
const path = require('path');
let config = require('./config.js').dev;
const writeToDisk = false;

const spinner = ora('building for development...');
//? 配置基础端口
portfinder.basePort = config.port;

//? 判断手动配置的端口是否可用，如果不可用生成可用端口
let portCanUse = portfinder.getPortPromise();

//? 编译前所有的promise
let needPromises = [portCanUse];

//? 如果资源存放在磁盘上面，每次编译先删除旧的资源文件
let assetPaths = Object.keys(webpackConfig.entry).map(p => path.join(config.assetsRoot, p));
writeToDisk && needPromises.push(del(assetPaths));

Promise.all(needPromises)
  .then(values => {
    let port = values[0];

    webpackConfig.plugins.push(new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://localhost:${port}`],
      },
      onErrors: config.notifyOnErrors
      ? utils.createNotifierCallback()
      : undefined
    }))
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.assetsPublicPath,
      stats: false,
      writeToDisk: false,
      logLevel: 'silent'
    }));

    app.use(hotMiddleware(compiler, {
      log: false,
      heartbeat: 2000
    }));

    app.listen(port, () => {
      console.log(chalk.blue(`listening on port ${port}`))
    })
  })
  .catch(err => {
    console.log(chalk.bgRed(err))
  })