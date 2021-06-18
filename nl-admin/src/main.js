import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/index.scss'

// http
import http from './http'
Vue.prototype.$http = http

// 混入图片上传的接口等
Vue.mixin({
  computed: {
    uploadImgURL() {
      return 'http://localhost:8888/admin/rest/upload'
    },
    uploadMusic() {
      return 'http://localhost:8888/admin/rest/uploadMusic'
    },
    uploadMV() {
      return 'http://localhost:8888/admin/rest/uploadMV'
    }
  },
  methods: {
    getAuth() { 
      return {
        Authorization: localStorage.token || '' 
      }
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
