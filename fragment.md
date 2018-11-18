# 架构特色

## 一分钟创建项目，省时省力
```javascript
npm run create:project
```

## 项目编译速度快
- 最新版本的webpack
- 分项目编译
```javascript
npm run dev [projectName]
```
**未来分项目模块编译**
每个同学只需要编译自己所做的模块
```javascript
npm run dev projectName --configModules [moduleName]
```

## 代码规范
- Eslint
- git validate-commit-msg

## 分工明确
每个同学负责独立的module，比如只负责飞机票模块，火车票模块，模块与模块之间互不干扰

**快速创建自己的模块**
```javascript
npm run create:module
```
- 独立的模块状态管理，带命名空间，，模块与模块之间不会发生冲突
- 独立的模块导航钩子，页面进入自己的模块，执行当前模块下面的导航钩子函数

**快速创建页面**
```javascript
npm run create:page
```

## 开发同学只用画界面

- 自动化创建页面（通过执行命令）
- 公共部分统一处理
  - 路由动画
  - 页面数据缓存与还原，只需要配置白名单
  - 页面登录权限
  - 页面缓存(keep-alive,导航钩子自动记住每个缓存页面的滚动位置，自动还原位置，无需手动)

## 性能优化
- 路由懒加载
- 路由预加载
- svg-sprite

## 配套设备
- babel(使用最新的语法)
- postcss(样式自动补全各个浏览器的兼容写法，移动端自动适配，样式全局导入，使用全局变量)
- eslint(团队统一的代码规范)

**后面加入mock数据**
只需要在执行命令的时候加入mock配置说明，拦截请求到本地查找相应的json文件，如果有相应的文件返回json文件数据，如果没有再转发请求到原始的请求地址