import Vue from 'vue'
import Vuex from 'vuex'
//! 机票
import airTicketStore from '../modules/airTicket/store.js'
/* @init<%
//! ${TplModuleIntroduction}
import ${TplModuleName}Store from '../modules/${TplModuleName}/store.js'%> */

Vue.use(Vuex)

const state = {
  //! 页面切换动画名称
  pageChangeAnimation: ''
}

const mutations = {
  //! 设置页面切换动画名称
  setPageChangeAnimation (state, name = '') {
    state.pageChangeAnimation = name
  }
}

export const store = new Vuex.Store({
  //? TODO:开启严格模式会深度监测状态树来检测不合规的状态变更，开发环境约束好，生产环境关闭掉
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  modules: {
    //! 机票
    airTicket: {
      namespaced: true,
      ...airTicketStore
    },
    /* @init<%
    //! ${TplModuleIntroduction}
    ${TplModuleName}: {
      namespaced: true,
      ...${TplModuleName}Store
    },%> */
  }
})

export default store
