<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt="logo" style="width: 40px; height:40px;vertical-align: -15px; margin: 5px;" />
        <span>南理音乐后台管理系统</span>
        <span class="current">当前用户：{{name}}</span>
        <span class="out" @click="logout">退出登录</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '../components/Aside'
export default {
  components: {
    Aside
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$message.success('退出成功！');
      this.$router.push('/login');
    }
  },
  computed: {
    name() {
      return localStorage.username || '';
    }
  }
}
</script>

<style lang="scss">
  .el-container {
    min-height: 100%;
    .el-header {
      background-color: #409EFF;
      color: #333;
      text-align: center;
      font-size: 30px;
      font-weight: 700;
      height: 80px !important;
      line-height: 80px;
      position: relative;
      >span {
        height: 100%;
      }
      .current {
        position: absolute;
        right: 50px;
        top: -25px;
        font-size: 14px;
        color: #FFF;
        text-decoration: underline;
      }
      .out {
        position: absolute;
        top: 30px;
        right: 50px;
        display: block;
        background-color: #fff;
        font-size: 16px;
        border: 3px solid #eaeaea;
        border-radius: 20px;
        cursor: pointer;
        width: 100px;
        height: 35px;
        line-height: 30px;
        &:hover {
          box-shadow: 0px 0px 10px #eee inset;
        }
      }
    }
    .el-aside {
      background-color: #DD55;
      color: #333;
      text-align: center;
    }
    .el-main {
      background-color: #FFF;
      color: #333;
    }
  }

</style>