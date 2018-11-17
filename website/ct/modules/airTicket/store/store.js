//? 机票状态管理器

const state = {
  test: ''
}

const mutations = {}

//? 添加缓存插件要用的mutations
const cachePluginMutations = {}
for (let key in state) {
  cachePluginMutations[`_set_${key}`] = (originState, val) => {
    originState[key] = val
  }
}

export const store = {
  state,
  mutations: {
    ...mutations,
    ...cachePluginMutations
  }
}

export default store
