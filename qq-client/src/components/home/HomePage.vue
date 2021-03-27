<template>
  <div class="home-page">
    <section class="home-album line-gra">
      <h2>专辑推荐</h2>
      <div class="album-container">
        <ul class="album-items" :style="{'left': albumLeft+'px'}">
          <li v-for="item in albumData" :key="item._id">
            <figure>
              <img :src="item.img" :alt="item.name">
            </figure>
            <p>专辑：{{ item.name }}</p>
            <p>唱片公司：{{ item.company }}</p>
            <i></i>
          </li>
        </ul>
        <nav class="album-btn">
          <i @click="goAlbum1" :class="{ active: albumLeft===0 }"></i>
          <i @click="goAlbum2" :class="{ active: albumLeft===-1100 }"></i>
        </nav>
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
    goAlbum1 () {
      this.albumLeft = 0
    },
    goAlbum2 () {
      this.albumLeft = -1100
    },
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
  .album-container>.album-btn {
    position: absolute;
    width: 40px;
    top: 90%;
    left: 50%;
    margin-left: -20px;
  }
  .album-btn>i {
    display: inline-block;
    background-color: #ccc;
    margin: 0 5px;
    cursor: pointer;
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .album-btn>i.active {
    background-color: #aaa;
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
    height: 75%;
    padding: 0 20px;
    font-size: 12px;
    position: relative;
  }
  .album-items>li>i {
    opacity: 0;
    width: 60px;
    height: 60px;
    background: url('../../assets/imgs/cover.png') no-repeat;
    background-size: contain;
    position: absolute;
    top: 65px;
    left: 80px;
    transform: scale(0.7);
    transition-property: opacity transform;
    transition-duration: 0.5s;
  }
  .album-items>li:hover>i {
    display: block;
    transform: scale(1);
    opacity: 1;
  }
  .album-items>li>figure {
    width: 100%;
    height: 180px;
    margin: 0 0 10px 0;
    overflow: hidden;
  }
  .album-items>li img {
    display: block;
    width: 100%;
    cursor: pointer;
    transition: width 0.2s ease-in;
  }
  .album-items>li:hover img {
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
