import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MyMusic from '../views/MyMusic.vue'
import Download from '../views/Download.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user',
    name: 'MyMusic',
    component: MyMusic
  },
  {
    path: '/download',
    name: 'Download',
    component: Download
  },
  {
    path: '/open',
    name: 'open',
    component: Download
  },
  {
    path: '/vip',
    name: 'vip',
    component: Download
  }
]

const router = new VueRouter({
  routes
})

export default router
