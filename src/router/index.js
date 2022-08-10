import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/addMenu.vue'
import uploadImg from '@/views/uploadImg.vue'
Vue.use(VueRouter)

const constantRouterMap = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/menuList',
    name: 'menuList',
    component: () => import('@/views/menuList.vue')
  },
  {
    path: '/uploadImg',
    name: 'uploadImg',
    component: () => import('@/views/uploadImg.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: "*",
    redirect: "/Home"
}
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
 
export default new VueRouter({
    routes: constantRouterMap
})
