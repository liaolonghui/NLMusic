import axios from 'axios'
import Vue from 'vue'
import router from './router/index'

const http = axios.create({
  baseURL: 'http://localhost:8888/admin'
})

http.interceptors.request.use(config => {
  if (localStorage.token) {
    config.headers.Authorization = localStorage.getItem('token') || '';
  }
  return config;
}, err => {
  return Promise.reject(err);
})

http.interceptors.response.use(res => {
  return res;
}, err => {
  if (err.response.data.message) {
    Vue.prototype.$message.error(err.response.data.message);

    // 如果状态码是401说明未登录（跳转到登录页）
    if (err.response.status === 401 || err.response.data.message == 'jwt malformed') {
      router.push('/login');
    }
  }

  return Promise.reject(err);
})

export default http