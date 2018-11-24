import Vue from 'vue'
import router from './routes/index.js'
import store from './store/index.js'
import App from './app.vue'
//! 导入公共样式
import 'components/styles/base.styl'
import { get } from 'components/tools/network.js'

//! 保存需要缓存的路由组件
if (router && router.options && router.options.routes) {
  let keepAliveComponents = []
  router.options.routes.forEach(item => {
    item.meta && item.meta.keepAlive && keepAliveComponents.push((item.name || ''))
  })
  store.commit('setKeepAliveComponents', [...(new Set(keepAliveComponents))])
}

//! 定义全局get请求
Object.defineProperty(Vue.prototype, '$get', {
  value: get
})

window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
