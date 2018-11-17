//? 状态管理器缓存插件

//  状态管理器中间件
/* let white = {
  //  存储类型：1：sessionStorage,2:localStorage,不传默认是sessionStorage
  storageType: Number,
  //  存储的状态的名称(必传参数，如果是带命名空间的使用斜杠拼接)
  stateName: String,
  //  缓存key的名字
  cacheKey: String
  //  还原状态时候指定路由名称（如果指定了路由名称）
} */
export default function createStorePlugin (whiteList = []) {
  return store => {
    //  还原数据
    whiteList.forEach(item => {
      let { storageType = 1, stateName = '', cacheKey = '' } = item
      let storage = storageType !== 2 ? window.sessionStorage : window.localStorage
      if (storage[cacheKey] && stateName !== '') {
        //  判断是否有响应的mutaition
        let stateNameArr = stateName.split('/')
        let lastStr = stateNameArr[stateNameArr.length - 1]
        let mutationName = `${(stateNameArr.splice(0, stateNameArr.length - 1)).join('/')}`
        mutationName = mutationName === '' ? `_set_${lastStr}` : `${mutationName}/_set_${lastStr}`
        if (store._mutations && store._mutations[mutationName]) {
          store.commit(mutationName, JSON.parse(storage[cacheKey]))
        }
      }
    })
    //  订阅mutation
    store.subscribe((mutation, state) => {
      //  存储数据
      whiteList.forEach(item => {
        let { storageType = 1, stateName = '', cacheKey = '' } = item
        if (stateName !== '' && cacheKey !== '') {
          let stateDatas = getdeepObjData(state, stateName)
          if (stateDatas || stateDatas === '') {
            let storage = storageType !== 2 ? window.sessionStorage : window.localStorage
            storage[cacheKey] = JSON.stringify(stateDatas)
          }
        }
      })
    })
  }
}

//  提取深层对象数据
function getdeepObjData (model = {}, str) {
  //  如果路径不能完全匹配，不提取数据
  let obj = false
  str.split('/').forEach((item, index) => {
    obj = (index === 0 ? model[item] : ((((obj && obj[item]) || obj[item]) === '' ? obj[item] : false)))
  })
  return obj
}
