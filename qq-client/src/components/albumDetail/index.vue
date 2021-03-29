<template>
  <div class="albumDetail">
    <main class="albumList">
      <section class="albumDes">
        <img :src="albumList[0].album.img" alt="logo" width="250">
        <aside>
          <h2>专辑名：{{ albumList[0].album.name }}</h2>
          <p style="color: #42b983;">歌手：{{ albumList[0].singer.name }}</p>
          <p style="color: #409EFF;">流派：{{ albumList[0].album.style.name }}</p>
          <p style="color: #B52257;">流派描述：{{ albumList[0].album.style.description }}</p>
          <p style="color: #FFDC00;">唱片公司：{{ albumList[0].album.company }}</p>
        </aside>
      </section>
      <table class="albumTable">
        <tr>
          <th>歌曲</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
        </tr>
        <tr v-for="music in albumList" :key="music._id">
          <td>
            {{ music.name }}
            <i @click="$emit('changeMusic', music.music[0].path, music.name, music.singer.name, music.album.img)"></i>
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
      musicsTime: {} // 保存所有音乐时长
    }
  },
  methods: {
    // 获取所有音乐的时长
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
    min-width: 200px;
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
</style>
