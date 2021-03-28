<template>
  <div class="albumDetail">
    <main class="albumList">
      <section class="albumDes">
        <img :src="albumList[0].album.img" alt="logo" width="250">
        <aside>
          <h2>专辑名：{{ albumList[0].album.name }}</h2>
          <p style="color: #42b983;">歌手：{{ albumList[0].singer.name }}</p>
          <p>流派：{{ albumList[0].album.style.name }}</p>
          <p>流派描述：{{ albumList[0].album.style.description }}</p>
          <p>唱片公司：{{ albumList[0].album.company }}</p>
        </aside>
      </section>
      <table class="albumTable">
        <tr>
          <th>歌曲</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
        </tr>
        <tr v-for="(music) in albumList" :key="music._id">
          <td>
            {{ music.name }}
            <i @click="playMusic(music._id, music.singer.name, music.name)"></i>
          </td>
          <td>{{ music.singer.name }}</td>
          <td>{{ music.album.name }}</td>
          <td>
            <audio @canplay="audioCanPlay(music._id)" :ref="music._id" :src="music.music[0].path" loop />
            {{ musicsTime[music._id] }}
          </td>
        </tr>
      </table>
    </main>
    <!-- 播放栏 -->
    <footer class="playRow" :class="{ top: scalePlay }" v-if="musicId">
      <p><b>{{ currentMusic.name }}</b><small> - {{ currentMusic.singer }}</small></p>
      <p>{{ currentMusic.time }} / {{ currentTime }}</p>
      <i @click="playOrPause" class="pause" :class="{ play: playing }"></i>
      <i class="toTop" :class="{ toBottom: scalePlay }" @click="scaleChange"></i>
      <label>音量：<input type="text" v-model="volume" ></label>
      <progress @mousedown="changeProgress" :value="nowCurrentTime" min="0" :max="currentMusic.nowTime"></progress>
      <figure v-if="scalePlay" class="bottom-album" @click="playOrPause">
        <img class="play-bar" :class="{ play: playing }" src="@/assets/imgs/play-bar.png" />
        <img class="albumImg" :class="{ pause: !playing }" :src="albumList[0].album.img" alt="album" />
      </figure>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String }
  },
  data () {
    return {
      albumList: [{ // 每一首歌都有自己的所属专辑，歌手，以及歌曲内容
        album: {
          style: {}
        },
        singer: {},
        music: [{}]
      }],
      musicsTime: {}, // 保存音乐时长(处理过)
      nowMusicTime: {}, // 保存音乐时长(未处理过)
      musicId: '', // 保存当前音乐id
      playing: false, // 是否正在播放音乐
      currentMusic: { // 当前音乐
        time: 0, // 处理过的时间
        nowTime: 0, // 未经处理的时间
        name: '',
        singer: ''
      },
      currentTime: '0:0', // 当前音乐已经播放时长
      nowCurrentTime: 0, // 未经处理的当前已播放
      volume: 0, // 音量
      scalePlay: false // 是否放大播放栏
    }
  },
  methods: {
    // 点击top或者bottom时
    scaleChange () {
      this.scalePlay = !this.scalePlay
    },
    // changeProgress
    changeProgress (e) {
      const rate = e.clientX / window.innerWidth
      this.nowCurrentTime = rate * this.currentMusic.nowTime
      this.$refs[this.musicId][0].currentTime = this.nowCurrentTime
    },
    // 保存当前音乐已播放时间
    saveCurrentTime (id) {
      return () => {
        const t = this.$refs[id][0].currentTime
        const s = Math.floor(t % 60)
        const m = Math.round(t / 60)
        this.currentTime = m + ':' + s
        this.nowCurrentTime = t
      }
    },
    // 播放音乐
    playMusic (id, singer, name) {
      if (this.$refs[id][0].paused) {
        clearInterval(this.timer)
        // 把其他音乐暂停
        this.albumList.forEach((music) => {
          this.$refs[music._id][0].pause()
          this.$refs[music._id][0].currentTime = 0
        })
        // 播放当前音乐
        this.$refs[id][0].play()
        this.musicId = id
        this.playing = true
        this.currentMusic.singer = singer
        this.currentMusic.name = name
        this.currentMusic.time = this.musicsTime[id]
        this.currentMusic.nowTime = this.nowMusicTime[id]
        this.timer = setInterval(this.saveCurrentTime(id), 1000)
        // 获取音量
        this.volume = this.$refs[id][0].volume * 100
      }
    },
    // 播放或暂停音乐
    playOrPause () {
      if (this.$refs[this.musicId][0].paused) {
        this.$refs[this.musicId][0].play()
        this.playing = true
        this.timer = setInterval(this.saveCurrentTime(this.musicId), 1000)
      } else {
        this.$refs[this.musicId][0].pause()
        this.playing = false
        clearInterval(this.timer)
      }
    },
    // audio
    audioCanPlay (id) {
      const musicDom = this.$refs[id]
      const min = Math.floor(musicDom[0].duration / 60)
      const second = Math.round(musicDom[0].duration % 60)
      const time = min + ':' + second
      this.$set(this.musicsTime, id, time)
      this.$set(this.nowMusicTime, id, musicDom[0].duration)
    },
    // 获取专辑中歌曲信息等
    async getAlbumList () {
      const res = await this.$http.get(`album/${this.id}`)
      if ((res.status >= 200 && res.status < 300) || res.status === 304) {
        this.albumList = res.data
      }
    }
  },
  created () {
    this.getAlbumList()
  },
  watch: {
    volume (newVolume) {
      if (newVolume > 100) {
        this.$refs[this.musicId][0].volume = 1
      } else if (newVolume < 0) {
        this.$refs[this.musicId][0].volume = 0
      } else {
        this.$refs[this.musicId][0].volume = newVolume / 100
      }
    }
  }
}
</script>

<style>
  .albumDetail {
    margin-bottom: 100px;
  }
  .albumList {
    width: 1150px;
    margin: 0 auto;
  }
  .albumDes {
    display: flex;
  }
  .albumDes>aside {
    margin: 10px 0 0 20px;
    line-height: 25px;
  }
  .albumTable {
    border-spacing: 0;
    margin-top: 30px;
  }
  .albumTable>tr:nth-child(2n-1) {
    background-color: #eee;
  }
  .albumTable>tr>th {
    height: 40px;
    text-align: left;
    padding-left: 10px;
  }
  .albumTable>tr>td {
    padding-left: 10px;
    width: 200px;
    height: 40px;
  }
  .albumTable>tr>td:first-child {
    cursor: pointer;
    position: relative;
  }
  .albumTable>tr>td:first-child>i {
    display: none;
    width: 30px;
    height: 30px;
    background: url('../../assets/imgs/cover.png');
    background-size: contain;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    right: 50px;
  }
  .albumTable>tr>td:first-child:hover>i {
    display: block;
  }
  .playRow {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 70px;
    background-color: #242424;
    padding-top: 15px;
    line-height: 20px;
    color: #fafafa;
    transition: height .3s ease-in;
  }
  .playRow.top {
    height: 100%;
  }
  .playRow>p {
    padding-left: 50px;
  }
  .playRow>i.pause {
    background-color: #fff;
    background-image: url('../../assets/imgs/play.png');
    background-size: contain;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 66;
    left: 50%;
    margin-left: -20px;
    margin-top: -40px;
    cursor: pointer;
  }
  .playRow>i.play {
    background-image: url(../../assets/imgs/pause.png);
  }
  .playRow>progress {
    width: 100%;
    height: 10px;
    cursor: pointer;
    position: absolute;
    top: -3px;
  }
  .playRow>label {
    position: absolute;
    right: 200px;
    top: 25px;
    width: 100px;
  }
  .playRow>label>input {
    width: 30px;
  }
  /* totop tobottom */
  i.toTop {
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 50px;
    top: 20px;
    background-image: url(../../assets/imgs/top.png);
    background-size: contain;
    background-color: #242424;
    color: white;
  }
  i.toBottom {
    background-image: url(../../assets/imgs/bottom.png);
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
    margin-left: -10px;
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
    animation: rotateAnimation 10s linear infinite;
  }
  .bottom-album>img.albumImg.pause {
    animation-play-state: paused;
  }
</style>
