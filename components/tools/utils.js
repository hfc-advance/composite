//? 判断参数是否是个function类型
export function isFunction (arg) {
  return arg && Object.prototype.toString.call(arg) === '[object Function]'
}

//? 主线程空闲的时候
export function requestIdleCallback (callback) {
  if (!isFunction(callback)) return false
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, {
      timeout: 2000
    })
  } else {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      callback()
    }, 100)
  }
}

export default {
  isFunction,
  requestIdleCallback
}
