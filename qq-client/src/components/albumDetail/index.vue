<template>
  <div>
    <div>专辑名：{{albumList[0].album.name}}</div>
    <ul>
      <li v-for="music in albumList" :key="music._id">
        <h2>歌曲名：{{ music.name }}</h2>
        <h3>歌手名：{{ music.singer.name }}</h3>
        <h4>专辑：{{ music.album.name }}</h4>
        <audio :src="music.music[0].path" controls></audio>
      </li>
    </ul>
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
        album: {},
        singer: {},
        music: [{}]
      }]
    }
  },
  methods: {
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
