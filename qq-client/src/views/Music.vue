<template>
  <div class="music">
    <nav>
      <router-link to="/home/">首页</router-link>
      <router-link to="/home/singer">歌手</router-link>
      <router-link to="/home/newMusic">新碟</router-link>
      <router-link to="/home/top">排行榜</router-link>
      <router-link to="/home/sort">分类榜单</router-link>
      <router-link to="/home/tv">电台</router-link>
      <router-link to="/home/album">数字专辑</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style>
  div.music>nav {
    width: 660px;
    height: 52px;
    margin: 0 auto;
    line-height: 52px;
    font-size: 14px;
  }

  div.music>nav>a {
    color: black;
    margin-left: 30px;
  }
  div.music>nav>a.router-link-exact-active {
    color: #42b983;
  }
</style>
