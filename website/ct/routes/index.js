import Vue from 'vue'
import VueRouter from 'vue-router'
import routerHooks from './hooks.js'
//! 机票
import airTicketRoutes from '../modules/airTicket/routes.js'
/* @init<%
//! ${TplModuleIntroduction}
import ${TplModuleName}Routes from '../modules/${TplModuleName}/routes.js'%> */

Vue.use(VueRouter)
/* eslint-disable */
export const router = new VueRouter({
  routes: [
    //! 机票
    ...airTicketRoutes,
    /* @init<%
    //! ${TplModuleIntroduction}
    ...${TplModuleName}Routes,%>*/
  ]
})
/* eslint-enable */
//? 添加路由钩子
routerHooks(router)

export default router
