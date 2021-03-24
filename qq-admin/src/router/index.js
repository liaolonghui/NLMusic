import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Local from '../views/Local.vue'
import Home from '../views/Home.vue'
import Sty from '../views/Sty.vue'
import Album from '../views/Album.vue'
import Music from '../views/Music.vue'
import Singer from '../views/Singer.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      { path: '/', name: 'home', component: Home },
      { path: '/location', name: 'Location', component: Local },
      { path: '/style', name: 'style', component: Sty },
      { path: '/album', name: 'album', component: Album },
      { path: '/music', name: 'music', component: Music },
      { path: '/singer', name: 'singer', component: Singer },
      { path: '/admin', name: 'admin', component: Admin },
    ]
  },{
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { isPublic: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果不是访问可公开页面，并且没有token则跳转到登录页。
  if (!to.meta.isPublic && !localStorage.token) {
    return next('/login');
  }
  next();
})

export default router
