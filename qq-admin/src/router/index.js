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
  },
]

const router = new VueRouter({
  routes
})

export default router
