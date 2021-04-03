<template>
  <div>
    <div v-if="singer._id" class="singer-detail">
      <img :src="singer.img" alt="singer">
      <article>
        <p style="color: #FFDC00;">歌手：{{singer.name}}</p>
        <p>性别：{{singer.sex}}</p>
        <p style="color: #42b983;">歌手描述：{{singer.description}}</p>
        <p>国家/地区：{{singer.country.country}}</p>
        <p>语种：{{singer.country.lang}}</p>
        <p style="color: #409EFF;">风格流派：{{singer.style.name}}</p>
        <p style="color: #409EFF;">流派描述：{{singer.style.description}}</p>
      </article>
    </div>
    <section class="singer-albums">
      <h2 align="center" style="padding-top: 20px;">专辑</h2>
      <article class="albums">
        <figure v-for="album in albumList" :key="album._id" @click="$router.push(`/home/album/${album._id}`)">
          <img :src="album.img" alt="albumImg">
          <p>专辑：{{ album.name }}</p>
          <p>唱片公司：{{ album.company }}</p>
        </figure>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    singerID: { type: String }
  },
  data () {
    return {
      singer: {},
      albumList: []
    }
  },
  methods: {
    async getSingerDetail () {
      const res = await this.$http.get(`singer/${this.singerID}`)
      this.singer = res.data
    },
    async getAlbumList () {
      const res = await this.$http.get(`albumList/${this.singerID}`)
      this.albumList = res.data
    }
  },
  created () {
    this.getSingerDetail()
    this.getAlbumList()
  }
}
</script>

<style>
  .singer-detail {
    width: 1100px;
    margin: 20px auto;
    display: flex;
  }
  .singer-detail>article {
    padding: 30px;
  }
  .singer-detail>article>p {
    margin-bottom: 6px;
  }
  .singer-detail img {
    height: 400px;
  }
  .singer-albums {
    width: 1100px;
    margin: 20px auto;
    padding-top: 10px;
  }
  .singer-albums h2 {
    padding: 30px 0 20px 0;
  }
</style>
