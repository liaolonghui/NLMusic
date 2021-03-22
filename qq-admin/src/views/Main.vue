<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt="logo" style="width: 40px; height:40px;vertical-align: -15px; margin: 5px;" />
        <span>南理音乐后台管理系统</span>
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
      >span {
        height: 100%;
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