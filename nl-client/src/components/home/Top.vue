<template>
  <div id="top">
    <h2 align="center" style="margin: 30px 0 20px 0;">排行榜</h2>
    <ul id="top-type" @click="changeType">
      <li class="active">音乐排行榜</li>
      <li>专辑排行榜</li>
      <li>歌手排行榜</li>
    </ul>
    <!-- music -->
    <article v-if="type === 'music'" id="musicTop">
      <table>
        <tr>
          <th>歌曲</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>播放</th>
          <th>收藏人数</th>
        </tr>
        <tr v-for="music in musicTop" :key="music._id">
          <td>{{music.name}}</td>
          <td><p @click="$router.push(`/home/singer/${music.singer._id}`)">{{music.singer.name}}</p></td>
          <td><p @click="$router.push(`/home/album/${music.album._id}`)">{{music.album.name}}</p></td>
          <td><button @click="changeMusic(music)">播放{{music.name}}</button></td>
          <td>{{music.love || 0}}</td>
        </tr>
      </table>
    </article>
    <!-- album -->
    <article v-if="type === 'album'" id="albumTop">
      <table>
        <tr>
          <th>专辑</th>
          <th>唱片公司</th>
          <th>专辑封面</th>
          <th>收藏人数</th>
        </tr>
        <tr v-for="album in albumTop" :key="album._id" @click="$router.push(`/home/album/${album._id}`)">
          <td>{{album.name}}</td>
          <td>{{album.company}}</td>
          <td><img :src="album.img" alt="albumIMG" width="100px"></td>
          <td>{{album.love || 0}}</td>
        </tr>
      </table>
    </article>
    <!-- singer -->
    <article v-if="type === 'singer'" id="singerTop">
      <table>
        <tr>
          <th>歌手</th>
          <th>性别</th>
          <th>照片</th>
          <th>描述</th>
          <th>收藏人数</th>
        </tr>
        <tr v-for="singer in singerTop" :key="singer._id" @click="$router.push(`/home/singer/${singer._id}`)">
          <td>{{singer.name}}</td>
          <td>{{singer.sex}}</td>
          <td><img :src="singer.img" alt="singerIMG"></td>
          <td><p>{{singer.description}}</p></td>
          <td>{{singer.love || 0}}</td>
        </tr>
      </table>
    </article>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 'music',
      musicTop: [],
      albumTop: [],
      singerTop: []
    }
  },
  methods: {
    // 改变当前播放的音乐(vuex)
    changeMusic (music) {
      this.$store.dispatch('changeMusic', {
        name: music.name,
        path: music.music[0].path,
        singer: music.singer.name,
        img: music.album.img
      })
    },
    // changeType
    changeType (e) {
      if (e.currentTarget === e.target) return
      const types = e.currentTarget.children
      for (let i = 0; i < types.length; i++) {
        if (types[i] === e.target) {
          types[i].classList.add('active')
          if (i === 0) {
            this.type = 'music'
          } else if (i === 1) {
            this.type = 'album'
          } else if (i === 2) {
            this.type = 'singer'
          }
        } else {
          types[i].classList.remove('active')
        }
      }
    },
    // 获取排行榜数据
    async getTop () {
      const res = await this.$http.get('Top')
      this.musicTop = res.data.musics
      this.albumTop = res.data.albums
      this.singerTop = res.data.singers
    }
  },
  created () {
    this.getTop()
  }
}
</script>

<style>
  #top {
    width: 1200px;
    margin: 0 auto;
  }
  ul#top-type {
    display: flex;
    margin: 20px 0 30px 150px;
  }
  #top-type > li {
    margin-right: 30px;
    cursor: pointer;
  }
  #top-type > li.active {
    color: #42b983;
  }
  /* music */
  #musicTop table {
    text-align: left;
    border-spacing: 0;
  }
  #musicTop table p:hover {
    color: #42b983;
  }
  #musicTop table tr {
    cursor: pointer;
  }
  #musicTop table tr:hover {
    background-color: #fafafa;
  }
  #musicTop table td {
    min-width: 260px;
    padding: 15px 0 20px 0;
    border-bottom: 1px solid #42b983;
  }
  #musicTop table td:last-child {
    min-width: 100px;
  }
  #musicTop table button {
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    outline: none;
    cursor: pointer;
  }
  #musicTop table button:hover {
    color: #42b983;
    border-color: #42b983;
  }
  /* album */
  #albumTop table {
    text-align: left;
    border-spacing: 0;
  }
  #albumTop table tr {
    cursor: pointer;
  }
  #albumTop table tr:hover {
    background-color: #fafafa;
  }
  #albumTop table td {
    min-width: 300px;
    border-bottom: 1px solid #42b983;
  }
  /* singer */
  #singerTop img {
    width: 100px;
  }
  #singerTop table {
    text-align: left;
    border-spacing: 0;
    cursor: pointer;
  }
  #singerTop table td {
    min-width: 200px;
    padding: 5px;
    border-bottom: 1px solid #42b983;
  }
  #singerTop table td:nth-child(2) {
    min-width: 60px;
  }
  #singerTop table td:nth-child(3) {
    min-width: 110px;
  }
  #singerTop td p {
    max-width: 600px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #singerTop tr {
    border-bottom: 1px solid #ccc;
  }
  #singerTop tr:hover {
    background-color: #fafafa;
  }
</style>
