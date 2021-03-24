<template>
  <el-menu
    router
    unique-opened
    :default-active="getIndex"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <!-- 标签管理 -->
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>标签管理</span>
      </template>
      <el-menu-item index="location">
        <i class="el-icon-location"></i>
        <span>国家/地区</span>
      </el-menu-item>
      <el-menu-item index="style">
        <i class="el-icon-s-comment"></i>
        <span>音乐流派</span>
      </el-menu-item>
    </el-submenu>
    <!-- 歌曲管理 -->
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-service"></i>
        <span>歌曲管理</span>
      </template>
      <el-menu-item index="album">
        <i class="el-icon-folder"></i>
        <span>专辑管理</span>
      </el-menu-item>
      <el-menu-item index="music">
        <i class="el-icon-service"></i>
        <span>歌曲管理</span>
      </el-menu-item>
    </el-submenu>
    <!-- 歌手管理 -->
    <el-menu-item index="singer">
      <i class="el-icon-mic"></i>
      <span>歌手管理</span>
    </el-menu-item>
    <!-- 管理员 -->
    <el-menu-item index="admin">
      <i class="el-icon-user-solid"></i>
      <span>管理员</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  computed: {
    getIndex() {
      return this.$route.path.split('/')[1];
    }
  },
}
</script>