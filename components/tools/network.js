import axios from 'axios'
import { prodApiAddress, devApiAddress } from 'components/tools/constants/index.js'
import { apiLoading } from './loading/index.js'

//? 接口地址
const API_ROOT = /^(http|https).*ct.ctrip.com/.test(window.location.href) ? prodApiAddress : devApiAddress
var instance = axios.create({
  baseURL: process.NODE_ENV === 'production' ? `${API_ROOT}/m/` : `m/`,
  withCredentials: true,
  timeout: 10000
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(config => {
  apiLoading.show()
  return config
})

axios.interceptors.response.use(res => {
  apiLoading.hide()
  return res
})

export async function get (url, data = {}) {
  instance.get(url, { params: data })
}
