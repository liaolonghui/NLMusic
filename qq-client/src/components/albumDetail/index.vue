<template>
  <div>
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
    <footer class="playRow" v-if="musicId">
      <b>{{ currentMusic.name }}</b><small> - {{ currentMusic.singer }}</small>
      <p>{{ currentMusic.time }} / {{ currentTime }}</p>
      <i @click="playOrPause" :class="{ play: playing }"></i>
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
      musicsTime: {}, // 保存音乐时长
      musicId: '', // 保存当前音乐id
      playing: false, // 是否正在播放音乐
      currentMusic: { // 当前音乐
        time: 0,
        name: '',
        singer: ''
      },
      currentTime: '0:0' // 当前音乐已经播放时长
    }
  },
  methods: {
    // 保存当前音乐已播放时间
    saveCurrentTime (id) {
      return () => {
        const t = this.$refs[id][0].currentTime
        const s = Math.floor(t % 60)
        const m = Math.round(t / 60)
        this.currentTime = m + ':' + s
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
        this.timer = setInterval(this.saveCurrentTime(id), 1000)
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
  }
}
</script>

<style>
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
    background-color: #42b983;
    padding-top: 15px;
    padding-left: 50px;
    line-height: 20px;
  }
  .playRow>i {
    background-image: url('../../assets/imgs/cover.png');
    background-size: contain;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50%;
    margin-left: -20px;
    margin-top: -40px;
    cursor: pointer;
  }
  i.play {
    background-image: url(../../assets/imgs/play.jpg) !important;
  }
</style>
