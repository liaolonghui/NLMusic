import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MyMusic from '../views/MyMusic.vue'
import Music from '../views/Music.vue'
import Login from '../views/Login.vue'
import Search from '../views/Search.vue'
import Download from '../components/other/Download.vue'
import Singer from '../components/home/Singer.vue'
import Top from '../components/home/Top.vue'
import MV from '../components/home/MV.vue'
import Album from '../components/home/Album.vue'
import HomePage from '../components/home/HomePage.vue'
import AlbumDetail from '../components/albumDetail/index.vue'
import SingerDetail from '../components/singerDetail/index.vue'
import MVDetail from '../components/mvDetail/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/home',
        name: 'Music',
        component: Music,
        children: [
          { path: '/home', name: 'HomePage', component: HomePage },
          { path: '/home/singer', name: 'Singer', component: Singer },
          { path: '/home/top', name: 'Top', component: Top },
          { path: '/home/mv', name: 'MV', component: MV },
          { path: '/home/album', name: 'Album', component: Album },
          // ...
          { path: '/home/album/:id', name: 'AlbumDetail', component: AlbumDetail, props: true },
          { path: '/home/singer/:singerID', name: 'SingerDetail', component: SingerDetail, props: true },
          { path: '/home/mv/:id', name: 'MVDetail', component: MVDetail, props: true }
        ]
      },
      // ...
      { path: '/search/:query', name: 'Search', component: Search, props: true },
      { path: '/user', name: 'MyMusic', component: MyMusic },
      { path: '/download', name: 'Download', component: Download },
      { path: '/open', name: 'open', component: Download },
      { path: '/vip', name: 'vip', component: Download }
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
