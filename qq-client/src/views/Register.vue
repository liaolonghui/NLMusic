<template>
  <div class="register">
    <img src="@/assets/imgs/register.jpg" alt="register">
    <form ref="register">
      <label>
        <span>用户名</span>
        <input type="text" name="username">
      </label>
      <label>
        <span>邮箱</span>
        <input type="text" name="email">
        <span @click.prevent="getCode" style="margin-left: 10px; color: #42b983; font-size: 12px; cursor: pointer;">获取验证码</span>
      </label>
      <label>
        <span>验证码</span>
        <input type="text" name="code">
      </label>
      <label>
        <span>密码</span>
        <input type="password" name="password">
      </label>
      <input type="submit" @click.prevent="handleSubmit" id="submit">
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    // 提交表单
    handleSubmit () {
      const username = this.$refs.register.username.value
      const password = this.$refs.register.password.value
      const email = this.$refs.register.email.value
      const code = this.$refs.register.code.value
      // 获取到表单数据后
      console.log(username, password, email, code)
    },
    // 获取验证码
    getCode () {
      const email = this.$refs.register.email.value
      const reg = /^\w{5,}@\w{1,}\.\w{1,}$/
      if (email.trim()) {
        if (reg.test(email)) {
          console.log(email)
        }
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
  .register > form {
    display: inline-block;
    margin: 100px 0 0 150px;
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
</style>
