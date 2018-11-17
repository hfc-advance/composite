//? 状态缓存白名单
/** let white = {
  //!  存储类型：1：sessionStorage,2:localStorage,不传默认是sessionStorage
  storageType: Number,
  //!  存储的状态的名称(必传参数，状态名称)
  stateName: String,
  //!  缓存key的名字(必传参数)
  cacheKey: String
} */
const whites = []

export const config = whites.map(item => {
  return {
    ...item,
    stateName: `{{TplModuleName}}/${item.stateName}`
  }
})

export default config
