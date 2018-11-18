const prompt = require('inquirer').createPromptModule();
const pathExists = require('path-exists');
const CWD = process.cwd();
const copy = require('kopy');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const spinner = ora(`模块初始化中`);
const utils = require('./utils.js');
const bluebird = require('bluebird').promisifyAll(fs);

//? path
let getRoutesPath = (answers) => path.resolve(CWD, `./website/${answers.TplProjectName}/modules/${answers.TplModuleName}/routes/routes.js`);

function launch () {
    prompt([
      {
        type: 'input',
        name: 'TplProjectName',
        message: '请输入要创建的项目名称(英文)',
        validate: function (str) {
          return str && str.length > 0
        }
      }
    ])
    .then(answers => {
      spinner.start();
      fileDirectoryExists(answers.TplProjectName)
        .then(isExists => {
          if (isExists) {
            spinner.fail(`${answers.TplProjectName}项目已经存在`)
            return false;
          }
          copyTem(answers)
            .then(() => {
              spinner.succeed(`${answers.TplProjectName}项目构建完成`)
            })
            .catch((error) => {
              spinner.fail(error);
            })
        })
    })
    .catch(error => {
      spinner.fail(error)
    })
}

//? 判断目录是否存在
function fileDirectoryExists (url) {
  return pathExists(path.join('./website/', url))
}

//? 拷贝模板文件
function copyTem (answers) {
  let temDir = path.resolve(CWD, './components/template/project')
  let destDir = path.resolve(CWD, `./website/${answers.TplProjectName}`)
  return copy(temDir, destDir, {
    data: answers,
    template: require('jstransformer-handlebars')
  })
}

//? 往主文件里面写东西
function compiler (answers) {
  return Promise.all([syncRoutes(answers)]).then(() => answers)
}

//? 同步路由
function syncRoutes (answers) {
  let routesPath = getRoutesPath(answers);
  bluebird.readFileAsync(routesPath, 'utf8')
    .then(str => {
      return compile(answers, str)
    })
    .then(str => fs.writeFileAsync((routesPath), str, 'utf8'))
    .then(() => answers)
}

function compile(answers, fileStr) {
  return String.prototype.replace.call(fileStr, /\n*\s*\/\*.*@init<%((.|\s)*?)%>.*\*\//g, function (match, p1) {
    return (String.prototype.replace.call(p1, /\${(\w*)}/g, function (innMatch, innP1) {
      return answers[innP1]
    })) + '\r' +match
  })
}

launch();