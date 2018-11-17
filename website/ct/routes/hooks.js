//? 路由钩子

export function routerHooks (router) {
  if (!router) throw new Error('没有发现路由原型')

  //! 页面进来之前
  router.beforeEach((to, from, next) => {
    next()
  })

  //! 页面进来之后
  router.afterEach((to, from, next) => {
  })
}

export default routerHooks
