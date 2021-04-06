<template>
  <div class="register">
    <img src="@/assets/imgs/register.jpg" alt="register">
    <button id="login" @click="$router.push('/login')">已有帐号？</button>
    <form ref="register" autocomplete="off">
      <label>
        <span>用户名</span>
        <input type="text" name="username" required>
      </label>
      <label>
        <span>邮箱</span>
        <input type="text" name="email" required>
        <span @click.prevent="getCode" style="margin-left: 10px; color: #42b983; font-size: 12px; cursor: pointer;">获取验证码</span>
      </label>
      <span class="warn">{{statusMsg}}</span>
      <label>
        <span>验证码</span>
        <input type="text" name="code" required>
      </label>
      <label>
        <span>密码</span>
        <input type="password" name="password" required>
      </label>
      <span class="error">{{errMsg}}</span>
      <input type="submit" @click.prevent="handleSubmit" id="submit">
    </form>
  </div>
</template>

<script>
import CrytopJS from 'crypto-js'

export default {
  data () {
    return {
      statusMsg: '',
      errMsg: ''
    }
  },
  methods: {
    // 提交表单
    async handleSubmit () {
      const username = this.$refs.register.username.value
      const password = this.$refs.register.password.value
      const email = this.$refs.register.email.value
      const code = this.$refs.register.code.value
      // 获取到表单数据后
      if (username.trim() && password.trim() && email.trim() && code.trim()) {
        const reg = /^\w{5,}@\w{1,}\.\w{1,}$/
        if (reg.test(email)) {
          // 使用md5给密码加密
          const res = await this.$http.post('users/signup', {
            username: window.encodeURIComponent(username),
            password: CrytopJS.MD5(password).toString(), // MD5返回的是一个数组，必须toString一下
            email,
            code
          })
          if (res.status === 200) {
            if (res.data && res.data.code === 1) {
              alert('注册成功，将自动跳转至登录页面')
              this.$router.push('/login')
            } else {
              this.errMsg = res.data.msg
            }
          } else {
            this.errMsg = `服务器出错，错误码${res.status}`
          }
        } else {
          this.errMsg = '请填写正确的邮箱地址'
        }
      } else {
        this.errMsg = '请填写完整后再提交注册'
      }
      // 隔一段时间后自动清空提示信息
      setTimeout(() => {
        this.errMsg = ''
      }, 2000)
    },
    // 获取验证码
    async getCode () {
      // 先判断定时器是否清除（未清除说明现在距离上一次请求不大于60s，要return false;）
      const self = this
      if (self.timerid) {
        return false
      }
      this.statusMsg = '' // 清空
      const email = this.$refs.register.email.value
      const username = this.$refs.register.username.value
      const reg = /^\w{5,}@\w{1,}\.\w{1,}$/
      if (username.trim() && email.trim()) {
        if (reg.test(email)) {
          // 发请求获取验证码 （别忘了encodeURIComponent）
          const res = await this.$http.post('users/verify', { username: encodeURIComponent(username), email })
          if (res.status === 200 && res.data && res.data.code === 0) {
            let count = 60 // 倒计时60s
            self.statusMsg = `验证码已发送，剩余${--count}秒。`
            self.timerid = setInterval(() => {
              self.statusMsg = `验证码已发送，剩余${--count}秒。`
              if (count === 0) {
                clearInterval(self.timerid)
                self.timerid = null
                self.statusMsg = ''
              }
            }, 1000)
          } else {
            self.statusMsg = res.data.msg
          }
        } else {
          this.statusMsg = '请填写正确的邮箱地址'
        }
      } else {
        this.statusMsg = '请先填写用户名与邮箱地址'
      }
    }
  }
}
</script>

<style>
  .register {
    font-size: 20px;
  }
  .register > img {
    height: 653px;
    vertical-align: top;
  }
  .register > #login {
    position: absolute;
    top: 30px;
    right: 100px;
    cursor: pointer;
  }
  .register > form {
    display: inline-block;
    margin: 100px 0 0 150px;
    position: relative;
  }
  .register label {
    display: block;
    padding: 20px;
  }
  .register label>span {
    display: inline-block;
    width: 70px;
  }
  .register input {
    width: 320px;
    height: 40px;
    padding-left: 1em;
  }
  #submit {
    width: 380px;
    margin: 30px 0 0 30px;
    background-color: #42b983;
    border-radius: 20px;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .register > form > .warn {
    position: absolute;
    left: 100px;
    bottom: 50%;
    margin-bottom: 30px;
    font-size: 13px;
    color: #42b983;
  }
  .register > form > .error {
    position: absolute;
    left: 100px;
    bottom: 65px;
    font-size: 13px;
    color: red;
  }
</style>
