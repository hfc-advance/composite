import Vue from 'vue'
import router from './routes/index.js'
import store from './store/index.js'
import App from './app.vue'
//! 导入公共样式
import 'components/styles/base.styl'

window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
