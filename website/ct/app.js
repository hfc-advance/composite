import Vue from 'vue'
import router from './routes/index.js'
import store from './store/index.js'
import App from './app.vue'

window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
console.log(process.env.modules)
