<template>
  <div class="my-music" v-if="$store.state.user">
    <header id="myHeader">
      <span>当前用户：{{ $store.state.user.username }}</span>
    </header>
    <main>
      <ul id="myLike" class="clearfix" @click="changeType">
        <li class="active">我喜欢的专辑</li>
        <li>我喜欢的音乐</li>
        <li>我喜欢的歌手</li>
      </ul>
      <!-- 专辑 -->
      <section id="myAlbum" v-if="type === 'album'" class="clearfix">
        <h3>专辑</h3>
        <figure v-for="album in $store.state.user.albums" :key="album._id" @click="$router.push(`/home/album/${album._id}`)">
          <img :src="album.img" alt="albumIMG" />
          <p>专辑名：{{ album.name }}</p>
          <p>唱片公司：{{ album.company }}</p>
        </figure>
      </section>
      <!-- 音乐 -->
      <section id="myMusic" v-if="type === 'music'">
        <h3>音乐</h3>
        {{ $store.state.user.musics }}
      </section>
      <!-- 歌手 -->
      <section id="mySinger" v-if="type === 'singer'">
        <h3>歌手</h3>
        {{ $store.state.user.singers }}
      </section>
    </main>
  </div>
  <div v-else style="width: 200px; margin: 100px auto;">
    <h2>请在登陆后查看</h2>
    <button
      @click="$router.push('/login')"
      style="width: 166px; height: 50px; text-align: center;cursor: pointer"
    >
      登录
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 'album'
    }
  },
  methods: {
    // 改变观看的收藏
    changeType (e) {
      if (e.target === e.currentTarget) return
      const types = e.currentTarget.children
      for (let i = 0; i < types.length; i++) {
        if (types[i] === e.target) {
          types[i].classList.add('active')
        } else {
          types[i].classList.remove('active')
        }
      }
      const text = e.target.innerText
      if (text.indexOf('专辑') !== -1) {
        this.type = 'album'
      } else if (text.indexOf('音乐') !== -1) {
        this.type = 'music'
      } else if (text.indexOf('歌手') !== -1) {
        this.type = 'singer'
      }
    }
  },
  mounted () {
    // 获取用户信息
    this.$store.dispatch('setUser')
  }
}
</script>

<style>
.my-music {
  min-height: 500px;
}
#myHeader {
  height: 300px;
  background-image: url(../assets/imgs/myMusicBG.jpg);
}
#myHeader > span {
  display: block;
  width: 300px;
  margin: 0 auto;
  padding-top: 130px;
  color: aliceblue;
  font-size: 25px;
}
#myLike {
  margin: 20px 80px;
}
#myLike > li {
  float: left;
  margin-left: 30px;
  cursor: pointer;
}
#myLike > li.active {
  color: #42b983;
}
#myLike > li:hover {
  color: #42b983;
}
.my-music > main {
  margin-bottom: 80px;
}
.my-music > main h3 {
  margin: 20px;
}
.my-music > main section {
  width: 1200px;
  margin: 0 auto;
}
#myAlbum > figure {
  box-sizing: border-box;
  float: left;
  width: 220px;
  height: 250px;
  margin: 10px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
#myAlbum > figure:hover {
  box-shadow: 0 0 15px #ccc;
}
#myAlbum > figure > p {
  width: 200px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#myAlbum img {
  height: 80%;
}
</style>
