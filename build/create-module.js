const prompt = require('inquirer').createPromptModule();
const pathExists = require('path-exists');
const CWD = process.cwd();
const copy = require('kopy');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const spinner = ora(`模块初始化中`);
const bluebird = require('bluebird').promisifyAll(fs);

//? path
let getRoutesPath = (answers) => path.resolve(CWD, `./website/${answers.TplProjectName}/routes/index.js`);
let getStorePath = (answers) => path.resolve(CWD, `./website/${answers.TplProjectName}/store/index.js`);

function launch () {
  return prompt([
    {
      type: 'input',
      name: 'TplProjectName',
      message: '请输入要创建的模块属于哪一个项目:',
      validate: function (str) {
        return str && str.length > 0
      }
    },
    {
      type: 'input',
      name: 'TplModuleName',
      message: '请输入要创建的模块名称(英文):',
      validate: function (str) {
        return str && str.length > 0
      }
    },
    {
      type: 'input',
      name: 'TplModuleIntroduction',
      message: '请简单的介绍下要创建的模块（Introduction）:',
      validate: function (str) {
        return str && str.length > 0
      }
    }
  ])
    .then(answers => {
      spinner.start();
      Promise.all([fileDirectoryExists(answers.TplProjectName), fileDirectoryExists(`${answers.TplProjectName}/modules/${answers.TplModuleName}`)])
        .then(values => {
          let projectExists = values[0];
          let moduleExists = values[1]
          if (!projectExists) {
            throw new Error(`请确定${answers.TplProjectName}项目是否存在`)
          }
          if (moduleExists) {
            throw new Error(`${answers.TplProjectName}项目下的已经存在${answers.TplModuleName}模块，请重新命名模块名称`)
          }
          copyTem(answers)
            .then(() => {
              compiler(answers)
                .then(() => {
                  spinner.succeed(`${answers.TplProjectName}项目下的${answers.TplModuleName}模块构建完成`);
                })
                .catch((error) => {
                  spinner.fail(error);
                })
            })
            .catch(error => {
              spinner.fail(error);
            })
        })
        .catch(error => {
          spinner.fail(error);
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
  let temDir = path.resolve(CWD, './components/template/module')
  let destDir = path.resolve(CWD, `./website/${answers.TplProjectName}/modules/${answers.TplModuleName}`)
  return copy(temDir, destDir, {
    data: answers,
    template: require('jstransformer-handlebars')
  })
}

//? 往主文件里面写东西
function compiler (answers) {
  return Promise.all([syncRoutes(answers), syncStore(answers)]).then(() => answers)
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

//? 同步状态
function syncStore (answers) {
  let storePath = getStorePath(answers);
  bluebird.readFileAsync(storePath, 'utf8')
    .then(str => {
      return compile(answers, str)
    })
    .then(str => fs.writeFileAsync((storePath), str, 'utf8'))
    .then(() => answers)
}
function compile(answers, fileStr) {
  return String.prototype.replace.call(fileStr, /\n\s*\/\*.*@init<%((.|\s)*?)%>.*\*\//g, function (match, p1) {
    return (String.prototype.replace.call(p1, /\${(\w*)}/g, function (innMatch, innP1) {
      return answers[innP1]
    })) + '\r' +match
  })
}

launch();