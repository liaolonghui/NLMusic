import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.css'
import axios from 'axios'

Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:8888/client',
  timeout: 2000
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
