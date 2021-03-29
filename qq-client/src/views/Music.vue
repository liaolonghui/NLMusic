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
    <router-view @changeMusic="changeMusic"></router-view>
    <!-- footer 播放栏 -->
    <footer class="nowMusic" :class="{ top: scalePlay }" v-if="nowMusic">
      <progress @click="changeProgress" :value="nowMusicDetail.playTime" :max="nowMusicDetail.musicTime" class="progress"></progress>
      <audio :src="nowMusic" ref="musicAudio" autoplay></audio>
      <aside>
        <p>{{ nowMusicDetail.nowMusicTime }} / {{ nowMusicDetail.nowPlayTime }}</p>
        <p>歌曲：{{ nowMusicDetail.music }}</p>
        <p>歌手：{{ nowMusicDetail.singer }}</p>
      </aside>
      <i class="play" @click="pauseOrPlayMusic" :class="{ pause: pausePlay }"></i>
      <i class="toTop" :class="{ toBottom: scalePlay }" @click="scaleChange"></i>
      <label>音量：<input type="text" v-model="volume" ></label>
      <figure v-if="scalePlay" class="bottom-album" @click="pauseOrPlayMusic">
        <img class="play-bar" :class="{ play: !pausePlay }" src="@/assets/imgs/play-bar.png" />
        <img class="albumImg" :class="{ pause: pausePlay }" :src="nowMusicDetail.img" alt="album" />
      </figure>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nowMusic: '', // 当前所播放的音乐地址
      pausePlay: false, // 是否暂停音乐
      nowMusicDetail: {
        music: '',
        singer: '',
        img: '',
        nowMusicTime: '0:0', // 当前音乐时长
        nowPlayTime: '0:0', // 已播放时长
        musicTime: 0, // 未处理的音乐时长
        playTime: 0 // 未处理的已播放时长
      },
      volume: 100, // 音量
      scalePlay: false // 是否放大播放栏
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
    // 点击对应歌曲播放音乐
    changeMusic (path, music, singer, img) {
      clearInterval(this.musicTimer)
      this.pausePlay = false
      this.nowMusic = path
      this.$nextTick(() => {
        this.$refs.musicAudio.load()
        this.$refs.musicAudio.oncanplay = () => {
          const t = this.$refs.musicAudio.duration
          const m = Math.floor(t / 60)
          const s = Math.round(t % 60)
          this.nowMusicDetail.music = music
          this.nowMusicDetail.singer = singer
          this.nowMusicDetail.img = img
          this.nowMusicDetail.nowMusicTime = m + ':' + s
          this.nowMusicDetail.musicTime = t
          this.musicTimer = setInterval(this.savePlayTime, 1000)
        }
      })
    }
  },
  watch: {
    volume (newVolume) {
      if (newVolume > 100) {
        this.$refs.musicAudio.volume = 1
      } else if (newVolume < 0) {
        this.$refs.musicAudio.volume = 0
      } else {
        this.$refs.musicAudio.volume = newVolume / 100
      }
    }
  },
  destroyed () {
    clearInterval(this.musicTimer)
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
  /* footer */
  .nowMusic {
    background-color: #242424;
    width: 100%;
    height: 70px;
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
    width: 100%;
    height: 8px;
    position: absolute;
    top: -2px;
    left: 0;
    cursor: pointer;
  }
  .nowMusic>aside {
    margin: 10px 0 0 20px;
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
