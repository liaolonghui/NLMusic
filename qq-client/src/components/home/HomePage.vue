<template>
  <div class="home-page">
    <!-- album -->
    <section class="home-album line-gra">
      <h2>专辑推荐</h2>
      <ul class="choseStyle" @click="choseStyle">
        <li class="active">推荐</li>
        <li>POP流行</li>
        <li>轻音乐</li>
        <li>电子音乐</li>
        <li>SOUNDTRACK原声</li>
      </ul>
      <div class="album-container">
        <ul class="album-items" :style="{'left': albumLeft+'px'}">
          <li v-for="item in albumData" :key="item._id" @click="$router.push(`/home/album/${item._id}`)">
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
    <!-- music -->
    <section class="home-music line-gra">
      <h2>歌曲推荐</h2>
      <article class="music-container">
        <figure v-for="music in musicData" :key="music._id" class="music-item">
          <div class="albumImg" @click="$emit('changeMusic', music.music[0].path, music.name, music.singer.name, music.album.img)">
            <img :src="music.album.img" alt="albumImg">
            <i class="music-cover"></i>
          </div>
          <aside>
            <p @click="$router.push(`/home/album/${music.album._id}`)">专辑：{{ music.album.name }}</p>
            <p @click="$emit('changeMusic', music.music[0].path, music.name, music.singer.name, music.album.img)">音乐：{{ music.name }}</p>
            <p>歌手：{{ music.singer.name }}</p>
          </aside>
        </figure>
      </article>
    </section>
    <!-- 精彩推荐 -->
    <section class="line-gra" style="height: 200px;">
      <h2>....</h2>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      albumLeft: 0,
      albumData: [], // 专辑数据
      musicData: [] // 歌曲数据
    }
  },
  methods: {
    // 获取歌曲数据
    async getMusics () {
      const res = await this.$http.get('musics')
      this.musicData = res.data
    },
    // 切换专辑风格
    choseStyle (e) {
      const lis = e.currentTarget.children
      for (let i = 0; i < lis.length; i++) {
        if (lis[i] === e.target) {
          lis[i].classList.add('active')
          this.getAlbums(lis[i].innerHTML)
        } else {
          lis[i].classList.remove('active')
        }
      }
    },
    // 获取album数据
    async getAlbums (style) {
      style = style || '推荐'
      const res = await this.$http.get('albums', {
        params: { style }
      })
      this.albumData = res.data
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
    this.getMusics()
  }
}
</script>

<style>
  /* album */
  .home-album {
    height: 470px;
  }
  .home-album>h2 {
    text-align: center;
    display: block;
    padding: 40px 0 20px 0;
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
    transition: all 0.3s ease-in;
    -webkit-transition: all 0.3s ease-in;
    cursor: pointer;
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
    transition: transform 0.3s ease-in;
    -webkit-transition: transform 0.3s ease-in ;
  }
  .album-items>li:hover img {
    transform: scale(1.1);
    opacity: 0.8;
  }
  .home-album>span {
    background-color: whitesmoke;
    display: block;
    width: 0;
    height: 100px;
    font-size: 0;
    transition: all .3s linear;
    -webkit-transition: all .3s linear;
    line-height: 100px;
    text-align: center;
    z-index: 666;
    position: absolute;
    top: 340px;
    cursor: pointer;
  }
  .home-album:hover>span {
    width: 80px;
    font-size: 50px;
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
  /* choseAlbumStyle */
  .choseStyle {
    height: 30px;
    width: 550px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .choseStyle>li {
    float: left;
    margin: 0 15px 0 15px;
    cursor: pointer;
  }
  .choseStyle>li.active {
    color: #42b983;
  }
  /* music */
  .home-music {
    height: 550px;
  }
  .home-music>h2 {
    display: block;
    text-align: center;
    font-size: 30px;
    letter-spacing: 10px;
    padding: 30px 0 20px 0;
  }
  .music-container {
    height: 300px;
    width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
  }
  .music-item {
    height: 33.33%;
    width: 33.33%;
    margin: 10px 0;
    display: flex;
  }
  .music-item>.albumImg {
    width: 25%;
    overflow: hidden;
    cursor: pointer;
    position: relative;
  }
  .albumImg>img {
    width: 100%;
    transition: all .3s ease;
    -webkit-transition: all 0.3s ease;
  }
  .albumImg:hover>img {
    transform: scale(1.1);
    opacity: 0.8;
  }
  i.music-cover {
    opacity: 0;
    width: 20px;
    height: 20px;
    background-image: url(../../assets/imgs/cover.png);
    background-size: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
  }
  .albumImg:hover>.music-cover {
    opacity: 1;
    width: 36px;
    height: 36px;
    margin: -18px 0 0 -18px;
  }
  .music-item>aside {
    flex: 1;
    margin: 10px 0 0 20px;
    font-size: 15px;
  }
  .music-item p:first-child {
    color: #00A1D6 !important;
  }
  .music-item>aside>p:hover {
    color: #42b983;
    cursor: pointer;
  }
</style>
