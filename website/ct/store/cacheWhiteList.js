//? 缓存白名单
//! 飞机票模块白名单
import airTicketWhite from '../modules/airTicket/store/cacheWhiteList.js'
/* @init<%
//! ${TplModuleName}模块白名单
import ${TplModuleName}White from '../modules/${TplModuleName}/store/cacheWhiteList.js'%> */

/* eslint-disable */
export const whiteList = [
  ...airTicketWhite,
  /* @init<%...${TplModuleName}White,%>*/
]
/* eslint-enable */

export default whiteList
