<template>
  <div class="login-page">
    <el-card>
      <img src="../assets/logo.jpg" alt="logo">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">登录</el-button>
          <el-button style="margin-left: 30px;" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userForm: {},
      rules: {
        username: { required: true, message: '用户名不能为空', trigger: 'blur' },
        password: { required: true, message: '密码不能为空', trigger: 'blur' },
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post('login', this.userForm);   // 使用axios的响应拦截器拦截错误情况
          localStorage.token = res.data.token;
          localStorage.username = res.data.username;
          this.$router.push('/admin');
          this.$message.success('登录成功！');
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['userForm'].resetFields();
    }
  },
}
</script>

<style scoped lang="scss">
  .login-page {
    background: url('../assets/bg.jpg');
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-card {
      background-image: linear-gradient( to right, #eee, #ababab);
      width: 480px;
      height: 360px;
      background-color: #eaeaea;
      border-radius: 20px;
      border: 3px solid #fff;
      position: relative;
      overflow: visible;
      img {
        position: absolute;
        z-index: 66;
        top: -105px;
        left: 50%;
        margin-left: -105px;
        width: 210px;
        height: 210px;
        border-top: 3px solid #fff;
        border-left: 3px solid #fff;
        border-right: 3px solid #fff;
        border-radius: 50%;
      }
      .el-form {
        margin-top: 100px;
        padding: 20px;
      }
    }
  }
</style>