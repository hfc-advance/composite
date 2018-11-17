import { isFunction } from 'components/tools/utils.js'
import store from '../store/index.js'
/* @init<%
//! ${TplModuleName}模块钩子
import { entryBefore as ${TplModuleName}EntryBefore } from '../modules/${TplModuleName}/routes/routerHooks.js'%> */

//? 存放钩子模型
/* eslint-disable */
const hooksModel = {
  'test': '',
  /* @init<%
  ${TplModuleName}EntryBefore,%>*/
}
/* eslint-enable */

//? 页面切换动画
let isFirst = true
let pageWhereModel = {}
function setPageChangeAnimation (to, from) {
  //! 页面初次进来不产生动画
  if (isFirst) {
    isFirst = false
    return false
  }
  let { fullPath: toPath } = to
  let { fullPath: fromPath } = from
  pageWhereModel[toPath] = pageWhereModel[toPath] || []
  if (pageWhereModel[fromPath] && pageWhereModel[fromPath].indexOf(toPath) > -1) {
    store.commit('setPageChangeAnimation', 'slide-right')
  } else {
    pageWhereModel[toPath].push(fromPath)
    store.commit('setPageChangeAnimation', 'slide-left')
  }
}

//? 路由钩子
export function routerHooks (router) {
  if (!router) throw new Error('没有发现路由原型')

  //! 页面进来之前
  router.beforeEach((to, from, next) => {
    let { meta: { module } = {} } = to || {}
    //? 进入模块级导航钩子
    let entryBefore = hooksModel[`${module}EntryBefore`]
    if (entryBefore && isFunction(entryBefore)) {
      Promise.resolve(entryBefore())
        .then(result => {
          if (result !== false) {
            //! 设置路由动画
            setPageChangeAnimation(to, from)
            next()
          }
        })
        .catch(error => {
          throw new Error(error)
        })
    } else {
      //! 设置路由动画
      setPageChangeAnimation(to, from)
      next()
    }
  })

  //! 页面进来之后
  router.afterEach((to, from) => {
    let { meta: { preload } = {} } = to || {}
    //? 预加载数据
    if (isFunction(preload)) {
      let timer = setTimeout(() => {
        preload()
        clearTimeout(timer)
      }, 2000)
    }
  })

  //! 导航失败
  router.onError(() => {
  })
}

export default routerHooks
