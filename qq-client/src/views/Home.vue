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
    <!-- footer 播放栏 -->
    <footer class="nowMusic" :class="{ top: scalePlay }" v-if="nowMusic">
      <progress @click="changeProgress" :value="nowMusicDetail.playTime" :max="nowMusicDetail.musicTime" class="progress"></progress>
      <audio :src="nowMusic" ref="musicAudio" autoplay></audio>
      <aside>
        <p>{{ nowMusicDetail.nowMusicTime }} / {{ nowMusicDetail.nowPlayTime }}</p>
        <p>歌曲：{{ $store.state.playMusic.name }}</p>
        <p>歌手：{{ $store.state.playMusic.singer }}</p>
      </aside>
      <i class="play" @click="pauseOrPlayMusic" :class="{ pause: pausePlay }"></i>
      <i class="toTop" :class="{ toBottom: scalePlay }" @click="scaleChange"></i>
      <label>音量：<input type="text" v-model="volume" ></label>
      <figure v-if="scalePlay" class="bottom-album" @click="pauseOrPlayMusic">
        <img class="play-bar" :class="{ play: !pausePlay }" src="@/assets/imgs/play-bar.png" />
        <img class="albumImg" :class="{ pause: pausePlay }" :src="$store.state.playMusic.img" alt="album" />
      </figure>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data () {
    return {
      nowMusic: '', // 当前所播放的音乐地址
      pausePlay: false, // 是否暂停音乐
      nowMusicDetail: {
        nowMusicTime: '0:0', // 当前音乐时长
        nowPlayTime: '0:0', // 已播放时长
        musicTime: 0, // 未处理的音乐时长
        playTime: 0 // 未处理的已播放时长
      },
      volume: 100, // 音量
      scalePlay: false, // 是否放大播放栏
      query: '' // 查询参数
    }
  },
  methods: {
    // 点击top或者bottom时
    scaleChange () {
      this.scalePlay = !this.scalePlay
    },
    // 改变播放进度
    changeProgress (e) {
      const rate = e.clientX / window.innerWidth
      const t = rate * this.nowMusicDetail.musicTime
      this.$refs.musicAudio.currentTime = t
    },
    // 保存已播放时长的函数
    savePlayTime () {
      const t = this.$refs.musicAudio.currentTime
      const m = Math.floor(t / 60)
      const s = Math.round(t % 60)
      this.nowMusicDetail.nowPlayTime = m + ':' + s
      this.nowMusicDetail.playTime = t
    },
    // 暂停音乐
    pauseOrPlayMusic () {
      if (this.$refs.musicAudio.paused) {
        this.$refs.musicAudio.play()
        this.pausePlay = false
        this.musicTimer = setInterval(this.savePlayTime, 1000)
      } else {
        this.$refs.musicAudio.pause()
        this.pausePlay = true
        clearInterval(this.musicTimer)
      }
    },
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
  },
  watch: {
    // 音量
    volume (newVolume) {
      if (newVolume > 100) {
        this.$refs.musicAudio.volume = 1
      } else if (newVolume < 0) {
        this.$refs.musicAudio.volume = 0
      } else {
        this.$refs.musicAudio.volume = newVolume / 100
      }
    },
    // 歌曲
    '$store.state.playMusic' (newMusic) {
      // 改变当前播放音乐
      clearInterval(this.musicTimer)
      this.pausePlay = false
      this.nowMusic = newMusic.path // 修改当前所播放的音乐
      this.$nextTick(() => {
        this.$refs.musicAudio.load()
        this.$refs.musicAudio.oncanplay = () => {
          const t = this.$refs.musicAudio.duration
          const m = Math.floor(t / 60)
          const s = Math.round(t % 60)
          this.nowMusicDetail.nowMusicTime = m + ':' + s
          this.nowMusicDetail.musicTime = t
          this.musicTimer = setInterval(this.savePlayTime, 1000)
        }
      })
    }
  },
  destroyed () {
    clearInterval(this.musicTimer)
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
  /* footer */
  .nowMusic {
    background-color: #242424;
    width: 100%;
    height: 70px;
    z-index: 999;
    position: fixed;
    bottom: 0;
    color: white;
    transition: height .3s ease-in;
  }
  .nowMusic.top {
    height: 100%;
  }
  .nowMusic>label {
    position: absolute;
    right: 200px;
    top: 25px;
    width: 100px;
  }
  .nowMusic>label>input {
    width: 30px;
  }
  .nowMusic>.progress {
    background-color: #42b983;
    width: 100%;
    height: 5px;
    position: absolute;
    top: -2px;
    left: 0;
    cursor: pointer;
  }
  .progress::-webkit-progress-bar {
    background: #ededed;
    border-radius: 8px;
  }
  .progress::-webkit-progress-value {
    background: #42b983;
    border-radius: 8px;
  }
  .nowMusic>aside {
    margin: 12px 0 0 50px;
  }
  .nowMusic p:nth-child(2) {
    font-size: 12px;
  }
  .nowMusic p:nth-child(3) {
    font-size: 12px;
  }
  .nowMusic>i.play {
    width: 36px;
    height: 36px;
    background-color: #fff;
    background-image: url(../assets/imgs/pause.png);
    background-size: contain;
    border-radius: 50%;
    z-index: 666;
    position: absolute;
    top: 17px;
    left: 50%;
    margin-left: -15px;
    cursor: pointer;
  }
  .nowMusic>i.pause {
    background-image: url(../assets/imgs/play.png);
  }
  /* totop tobottom */
  i.toTop {
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 50px;
    top: 20px;
    background-image: url(../assets/imgs/top.png);
    background-size: contain;
    background-color: #242424;
    color: white;
  }
  i.toBottom {
    background-image: url(../assets/imgs/bottom.png);
  }
  /* bottom-album */
  .bottom-album {
    position: relative;
    box-sizing: border-box;
    width: 430px;
    height: 430px;
    padding: 50px;
    margin: 100px auto 0 auto;
    background-color: #000;
    border: 15px solid #bbb;
    border-radius: 50%;
    cursor: pointer;
  }
  .bottom-album>img.play-bar {
    width: 150px;
    position: absolute;
    top: -130px;
    left: 50%;
    margin-left: -5px;
    transform: rotate(-30deg) translate(60px, -30px);
    transition: all .3s ease-in;
  }
  .bottom-album>img.play {
    transform: rotate(0) translate(0, 0);
  }
  @keyframes rotateAnimation {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .bottom-album>img.albumImg {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    animation: rotateAnimation 15s linear infinite;
  }
  .bottom-album>img.albumImg.pause {
    animation-play-state: paused;
  }
</style>
