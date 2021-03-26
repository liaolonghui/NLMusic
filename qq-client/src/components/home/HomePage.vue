<template>
  <div class="home-page">
    <section class="home-album line-gra">
      <h2>专辑推荐</h2>
      <div class="album-container">
        <ul class="album-items" :style="{'left': albumLeft+'px'}">
          <li v-for="item in albumData" :key="item._id">
            <img :src="item.img" :alt="item.name">
            <p>专辑：{{ item.name }}</p>
            <p>唱片公司：{{ item.company }}</p>
          </li>
        </ul>
      </div>
      <span id="lt" @click="lt">&lt;</span>
      <span id="gt" @click="gt">&gt;</span>
    </section>
    <section class="line-gra">
      <h2>....</h2>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      albumLeft: 0,
      albumData: []
    }
  },
  methods: {
    // 获取album数据
    async getAlbums () {
      const res = await this.$http.get('albums')
      this.albumData = res.data
      console.log(this.albumData)
    },
    // album按钮事件
    lt () {
      this.albumLeft -= 1100
      if (this.albumLeft < -1100) {
        this.albumLeft = 0
      }
    },
    gt () {
      this.albumLeft += 1100
      if (this.albumLeft > 0) {
        this.albumLeft = -1100
      }
    }
  },
  created () {
    this.getAlbums()
  }
}
</script>

<style>
  .home-album {
    height: 470px;
  }
  .home-album>h2 {
    text-align: center;
    display: block;
    padding: 50px 0;
    font-size: 30px;
    letter-spacing: 10px;
  }
  .home-album>.album-container {
    height: 300px;
    width: 1100px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  }
  .album-items {
    height: 100%;
    width: 200%;
    position: absolute;
    transition: left 0.5s linear;
  }
  .album-items>li {
    float: left;
    width: 10%;
    height: 90%;
    padding: 0 20px;
    font-size: 12px;
  }
  .album-items>li>img {
    width: 100%;
    cursor: pointer;
    transition: width opacity 0.7s ease-in;
  }
  .album-items img:hover {
    width: 110%;
    opacity: 0.8;
  }
  .home-album>span {
    display: block;
    width: 80px;
    height: 100px;
    background-color: whitesmoke;
    font-size: 50px;
    line-height: 100px;
    text-align: center;
    z-index: 666;
    position: absolute;
    top: 340px;
    cursor: pointer;
  }
  .home-album>span:hover {
    background-color: #ccc;
  }
  .home-album>span#lt {
    left: 0;
  }
  .home-album>span#gt {
    right: 0;
  }
</style>
