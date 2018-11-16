const prompt = require('inquirer').createPromptModule();
const pathExists = require('path-exists');
const CWD = process.cwd();
const copy = require('kopy');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const spinner = ora(`模块初始化中`);

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

launch();