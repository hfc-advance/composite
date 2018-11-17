//? 判断参数是否是个function类型
export function isFunction (arg) {
  return arg && Object.prototype.toString.call(arg) === '[object Function]'
}

export default {
  isFunction
}
