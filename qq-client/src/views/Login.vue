<template>
  <div class="login">
    <form ref="loginForm" autocomplete="OFF">
      <label>
        <span>用户名</span>
        <input type="text" name="username">
      </label>
      <label for="password">
        <span>密码</span>
        <input type="password" name="password">
      </label>
      <span class="msg">{{msg}}</span>
      <button @click.prevent="login">登录</button>
    </form>
    <button id="forget" @click="forgetPass">忘记密码？</button>
    <button id="register" @click="$router.push('/register')">注册</button>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    async login () {
      const username = this.$refs.loginForm.username.value
      const password = this.$refs.loginForm.password.value
      if (username.trim() && password.trim()) {
        const res = await this.$http.post('users/signin', {
          username: window.encodeURIComponent(username),
          password: CryptoJS.MD5(password).toString()
        })
        if (res.status === 200) {
          if (res.data && res.data.code === 1) {
            window.localStorage.setItem('token', res.data.token)
            this.$router.push('/')
          } else {
            this.msg = res.data.msg
          }
        } else {
          this.msg = `服务器出错，状态码${res.status}}`
        }
      } else {
        this.msg = '请先填写用户名与密码'
      }
      setTimeout(() => {
        this.msg = ''
      }, 2000)
    },
    forgetPass () {
      alert('暂无此服务')
    }
  }
}
</script>

<style>
  .login {
    width: 400px;
    height: 280px;
    background-color: #eee;
    margin: 100px auto;
    padding: 20px;
  }
  .login>form {
    position: relative;
  }
  .login label {
    display: block;
    padding: 10px;
  }
  .login label>span {
    display: inline-block;
    width: 70px;
  }
  .login input {
    width: 75%;
    height: 30px;
    padding-left: 1em;
  }
  .login>form>button {
    width: 90%;
    height: 35px;
    line-height: 35px;
    margin: 35px 0 0 12px;
    background-color: #42b983;
    outline: none;
    border: none;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  .login>form>button:hover {
    box-shadow: 0 0 25px #888 inset;
  }
  .login>form>.msg {
    position: absolute;
    bottom: 55px;
    left: 80px;
    font-size: 13px;
    color: #EF9302;
  }
  .login>#forget {
    margin-top: 45px;
    margin-left: 15px;
    cursor: pointer;
  }
  .login>#register {
    margin-left: 15px;
    cursor: pointer;
  }
</style>
