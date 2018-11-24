import Vue from 'vue'
//? 异步加载loading
const apiLoadingDOM = () => import(/* webpackChunkName: "api.loading" */'components/components/loading/api-loading.vue')

class ApiLoading {
  constructor () {
    let dom = document.createElement('div')
    dom.id = 'apiLoading'
    document.body.appendChild(dom)
    this.instance = new (Vue.extend({
      components: { loading: apiLoadingDOM },
      data () {
        return {
          showLoading: false
        }
      },
      template: `<div v-if="showLoading"><loading ref="loading"></loading></div>`
    }))()
    this.instance.$mount(dom)
  }
  show () {
    if (!this.instance) return false
    this.instance.showLoading = true
  }
  hide () {
    if (!this.instance) return false
    this.instance.showLoading = false
  }
}

export const apiLoading = new ApiLoading()

export default {
  apiLoading
}
