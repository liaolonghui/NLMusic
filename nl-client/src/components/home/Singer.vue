<template>
  <div class="singer-list">
    <section v-for="singer in singerList" :key="singer._id" @click="$router.push(`/home/singer/${singer._id}`)">
      <h3>{{ singer.name }}</h3>
      <p>性别：{{ singer.sex }}</p>
      <img :src="singerImg(singer.img)" alt="singer">
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      singerList: []
    }
  },
  methods: {
    async getSingerList () {
      const res = await this.$http.get('singerList')
      this.singerList = res.data
    },
    // 歌手图片
    singerImg (img) {
      return img || require('../../assets/imgs/defaultImg.jpg')
    }
  },
  created () {
    this.getSingerList()
  }
}
</script>

<style>
  .singer-list {
    width: 1000px;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #eee;
  }
  .singer-list>section {
    width: 23%;
    height: 250px;
    margin: 10px;
    padding: 10px;
    border: 1px solid #bbb;
    background-color: #fff;
    text-align: center;
    line-height: 30px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease-out;
  }
  .singer-list>section:hover {
    margin-top: 7px;
    margin-bottom: 13px;
    color: #42b983;
    box-shadow: 0 10px 10px #999;
  }
  .singer-list>section>img {
    max-width: 100%;
    max-height: 75%;
  }
</style>
