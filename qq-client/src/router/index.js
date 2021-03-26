import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MyMusic from '../views/MyMusic.vue'
import Download from '../views/Download.vue'
import Music from '../views/Music.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        name: 'Music',
        component: Music
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
  },
  // login
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
