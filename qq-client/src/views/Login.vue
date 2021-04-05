<template>
  <div class="login">
    <form ref="loginForm">
      <label>
        <span>用户名</span>
        <input type="text" name="username">
      </label>
      <label for="password">
        <span>密码</span>
        <input type="password" name="password">
      </label>
      <button @click.prevent="login">登录</button>
    </form>
    <button id="forget" @click="forgetPass">忘记密码？</button>
    <button id="register" @click="$router.push('/register')">注册</button>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      console.log(this.$refs.loginForm.username.value)
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
    margin: 20px 0 0 10px;
    background-color: #42b983;
    outline: none;
    border: none;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  .login>form>button:hover {
    box-shadow: 0 0 20px #888 inset;
  }
  .login>#forget {
    margin-top: 30px;
    margin-left: 10px;
    cursor: pointer;
  }
  .login>#register {
    margin-top: 30px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
