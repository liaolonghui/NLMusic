<template>
  <div class="home">
    <header>
      <span class="school" @click="$router.push('/')">
        <img src="@/assets/imgs/logo.jpg" alt="logo" width="50px">
        <span>南理音乐</span>
      </span>
      <nav class="header-nav">
        <router-link to="/home" :class="{'router-link-exact-active': HomeActive}">音乐馆</router-link>
        <router-link to="/user">我的音乐</router-link>
        <router-link to="/download" class="clientDown">
          <span>客户端</span>
          <div class="down">
            <p>HQ高品质 全员开启</p>
            <p>独家音效 全面升级</p>
            <p>轻盈视觉 动态皮肤</p>
            <button>下载体验</button>
          </div>
        </router-link>
        <router-link to="/open">开放平台</router-link>
        <router-link to="/vip">VIP</router-link>
      </nav>
      <form class="search">
        <input type="text" placeholder="搜索音乐、专辑、歌手、用户" v-model="query" @keydown.enter="search" :disabled="isSearch">
      </form>
      <button class="username" v-if="$store.state.user">
        当前用户：{{$store.state.user.username}}
      </button>
      <button class="btn" v-else @click="$router.push('/login')">
        登录
      </button>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data () {
    return {
      query: '' // 查询参数
    }
  },
  methods: {
    // 搜索
    search () {
      this.$router.push(`/search/${this.query}`)
      this.query = ''
    }
  },
  computed: {
    // path是否以/home开头
    HomeActive () {
      return this.$route.path.indexOf('/home') !== -1
    },
    // 是否处于搜索页
    isSearch () {
      return this.$route.path.indexOf('/search') !== -1
    }
  },
  mounted () {
    // 获取用户信息
    this.$store.dispatch('setUser')
  }
}
</script>

<style>

.home>header {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid #ccc;
}

header>.school {
  width: 200px;
  text-align: right;
  margin-top: 15px;
  margin-right: 40px;
  cursor: pointer;
}
header>.school>img {
  vertical-align: -15px;
}
header>.school>span {
  font-size: 30px;
  font-weight: 600;
  margin-left: 5px;
}

nav.header-nav a {
  display: inline-block;
  padding: 20px;
  height: 80px;
  line-height: 40px;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}
nav.header-nav a.router-link-exact-active {
  color: #fff !important;
  background-color: #42b983;
}
nav.header-nav a:hover {
  color: #42b983;
}

.search {
  margin-left: 50px;
  width: 250px;
  height: 80px;
  line-height: 80px;
}
.search>input {
  box-sizing: border-box;
  height: 35px;
  width: 100%;
  padding-left: 15px;
}

.username {
  background-color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: 20px;
  font-size: 13px;
  font-weight: 500;
}
.username:hover {
  color: #42b983;
}

.btn {
  background-color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: 100px;
  font-size: 16px;
  font-weight: 500;
}
.btn:hover {
  color: #42b983;
}

.clientDown {
  position: relative;
  z-index: 10;
}
.clientDown::before {
  content: '';
  position: absolute;
  top: 18px;
  left: 50px;
  display: block;
  width: 35px;
  height: 13px;
  background: url(../assets/imgs/mark.png);
  background-size: 35px 13px;
}
.clientDown:hover>.down {
  display: block;
}
.clientDown>.down {
  display: none;
  position: absolute;
  top: 65px;
  left: -17px;
  border: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 0 5px #aaa;
  width: 130px;
  height: 130px;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
  font-weight: normal;
  color: #2c3e50;
}
.clientDown>.down>button {
  border-radius: 10px;
  width: 100px;
  border: none;
  outline: none;
  background-color: #42b983;
  color: #fff;
  padding: 2px;
  font-size: 12px;
  cursor: pointer;
}
.clientDown>.down>button:hover {
  background-color: green;
}

</style>
