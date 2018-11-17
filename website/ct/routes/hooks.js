import { isFunction } from 'components/tools/utils.js'
/* @init<%
//! ${TplModuleName}模块钩子
import { entryBefore as ${TplModuleName}EntryBefore } from '../modules/${TplModuleName}/routerHooks.js'%> */

//? 存放钩子模型
/* eslint-disable */
const hooksModel = {
  'test': '',asjfasEntryBefore,
  /* @init<%${TplModuleName}EntryBefore,%>*/
}
/* eslint-enable */
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
          if (result !== false) next()
        })
        .catch(error => {
          throw new Error(error)
        })
    } else next()
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
