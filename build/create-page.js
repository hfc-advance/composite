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
  let projectChoices = Object.keys(utils.getEntries('./website'));
  prompt([
    {
      type: 'list',
      name: 'TplProjectName',
      message: '请选择要创建的页面属于哪个项目?',
      choices: projectChoices,
      validate: function (str) {
        return str && str.length > 0
      }
    }
  ])
  .then(projectAnswers => {
    let moduleChoices = Object.keys(utils.getEntries(`./website/${projectAnswers.TplProjectName}/modules`))
    prompt([
      {
        type: 'list',
        name: 'TplModuleName',
        message: '请选择要创建的页面属于哪一个模块?',
        choices: moduleChoices,
        validate: function (str) {
          return str && str.length > 0
        }
      },
      {
        type: 'input',
        name: 'TplModulePage',
        message: '请输入要创建的页面名称(英文最好是驼峰命名)：',
        validate: function (str) {
          return str && str.length > 0
        }
      },
      {
        type: 'confirm',
        name: 'loginAuth',
        message: '当前这个页面是否需要登录权限?',
      },
      {
        type: 'confirm',
        name: 'keepAlive',
        message: '当前这个页面的DOM是否需要缓存?',
      },
      {
        type: 'input',
        name: 'TplModulePageTitle',
        message: '请输入要创建的页面标题(最好是中文名称)：'
      }
    ])
    .then(answers => {
      let TplModuleNameUpper = answers.TplModuleName.replace(/^([a-z])/, (result, match) => (match && match.toUpperCase() || ''));
      let TplModulePageUpper = answers.TplModulePage.replace(/^([a-z])/, (result, match) => (match && match.toUpperCase() || ''));
      answers = Object.assign(answers, projectAnswers, { TplAnnotationStart: '/*', TplAnnotationEnd: '*/' }, { TplModuleNameUpper,  TplModulePageUpper })
      spinner.start();
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
      spinner.fail(error)
    })
  })
}

//? 判断目录是否存在
function fileDirectoryExists (url) {
  return pathExists(path.join('./website/', url))
}

//? 拷贝模板文件
function copyTem (answers) {
  let temDir = path.resolve(CWD, './components/template/pageComponent')
  let destDir = path.resolve(CWD, `./website/${answers.TplProjectName}/modules/${answers.TplModuleName}/${answers.TplModulePage}`)
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