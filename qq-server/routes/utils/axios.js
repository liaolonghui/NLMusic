const axios = require('axios');

const instance = axios.create({
  baseURL: 'localhost:8888',
  timeout: 1000,
  header: {}
})

module.exports = instance;