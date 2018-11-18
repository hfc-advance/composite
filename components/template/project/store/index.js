import Vue from 'vue'
import Vuex from 'vuex'
import createStorePlugin from 'components/tools/storePlugin.js'
import whiteList from './cacheWhiteList.js'
/* @init<%
//! ${TplModuleIntroduction}
import ${TplModuleName}Store from '../modules/${TplModuleName}/store/store.js'%> */

Vue.use(Vuex)

const state = {
  //! 页面切换动画名称
  pageChangeAnimation: '',
  //! 需要缓存的组件名称
  keepAliveComponents: []
}

const mutations = {
  //! 设置页面切换动画名称
  setPageChangeAnimation (state, name = '') {
    state.pageChangeAnimation = name
  },
  //! 设置缓存页面数据
  setKeepAliveComponents (state, aliveLists = []) {
    state.keepAliveComponents = aliveLists
  }
}

//? 添加缓存插件要用的mutations
const cachePluginMutations = {}
for (let key in state) {
  cachePluginMutations[`_set_${key}`] = (originState, val) => {
    originState[key] = val
  }
}

/* eslint-disable */
export const store = new Vuex.Store({
  //? TODO:开启严格模式会深度监测状态树来检测不合规的状态变更，开发环境约束好，生产环境关闭掉
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  modules: {
    /* @init<%
    //! ${TplModuleIntroduction}
    ${TplModuleName}: {
      namespaced: true,
      ...${TplModuleName}Store
    },%> */
  },
  plugins: [createStorePlugin(whiteList)]
})
/* eslint-enable */
export default store
