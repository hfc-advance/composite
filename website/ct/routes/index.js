import Vue from 'vue'
import VueRouter from 'vue-router'
//! 机票
import airTicketRoutes from '../modules/airTicket/routes.js'
//! 酒店
import hotelRoutes from '../modules/hotel/routes.js'
import mouseRoutes from '../modules/mouse/routes.js'


Vue.use(VueRouter)

export const router = new VueRouter({
  routes: [
    ...airTicketRoutes,
    ...hotelRoutes,
    ...mouseRoutes,
  ]
})

export default router