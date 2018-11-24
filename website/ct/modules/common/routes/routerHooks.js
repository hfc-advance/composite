//? 路由拦截器如果进入的页面是当前这个模块下面的，就会走这里的钩子函数

//! 页面进来之前(可以返回fasle阻止页面跳转,或者是一个promise做延迟跳转)
export function entryBefore (to, from) {
}

//! 页面进来之后
export function entryAfter (to, from) {
}

export default {
  entryBefore,
  entryAfter
}
