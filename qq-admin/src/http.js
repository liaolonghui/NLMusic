import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:8888/admin'
})

export default http