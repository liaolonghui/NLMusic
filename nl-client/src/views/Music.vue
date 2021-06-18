<template>
  <div class="music">
    <nav>
      <router-link to="/home/">首页</router-link>
      <router-link to="/home/album">数字专辑</router-link>
      <router-link to="/home/singer">歌手</router-link>
      <router-link to="/home/top">排行榜</router-link>
      <router-link to="/home/mv">音乐短片MV</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style>
  div.music {
    margin-bottom: 120px;
  }
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
