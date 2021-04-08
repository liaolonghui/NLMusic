<template>
  <div class="searchData">
    <header class="search-input">
      <input
        type="text"
        placeholder="搜索音乐、专辑、歌手、用户"
        v-model="searchParams"
        @keydown.enter="viewData"
      />
      <ul class="search-type" @click="viewData">
        <li class="now-type">专辑</li>
        <li>歌曲</li>
        <li>歌手</li>
      </ul>
    </header>
    <!-- 专辑搜索展示 -->
    <article v-if="searchType === '专辑'">
      <figure
        v-for="item in AlbumData"
        :key="item._id"
        @click="$router.push(`/home/album/${item._id}`)"
      >
        <img :src="item.img" alt="img" />
        <div class="item-description">
          <p>专辑：{{ item.name }}</p>
          <p>歌手：{{ item.singer.name }}</p>
          <p>流派：{{ item.style.name }}</p>
          <p>流派描述：{{ item.style.description }}</p>
          <p>唱片公司：{{ item.company }}</p>
        </div>
      </figure>
    </article>
    <!-- 歌曲搜索展示 -->
    <article v-if="searchType === '歌曲'">
      <table class="search-table music-table">
        <tr>
          <th>音乐</th>
          <th>歌手</th>
          <th>专辑</th>
        </tr>
        <tr v-for="music in musicData" :key="music._id">
          <td>
            <p @click="changeMusic(music)">{{ music.name }}</p>
          </td>
          <td>
            <p @click="$router.push(`/home/singer/${music.singer._id}`)">{{ music.singer.name }}</p>
          </td>
          <td>
            <p @click="$router.push(`/home/album/${music.album._id}`)">{{ music.album.name }}</p>
          </td>
        </tr>
      </table>
    </article>
    <!-- 歌手搜索展示 -->
    <article v-if="searchType === '歌手'">
      <table class="search-table singer-table">
        <tr>
          <th>歌手</th>
          <th>性别</th>
          <th>国家/地区</th>
          <th>语种</th>
          <th>流派</th>
        </tr>
        <tr v-for="singer in singerData" :key="singer._id" @click="$router.push(`/home/singer/${singer._id}`)">
          <td>
            <p>{{ singer.name }}</p>
          </td>
          <td>
            <p>{{ singer.sex }}</p>
          </td>
          <td>
            <p>{{ singer.country.country }}</p>
          </td>
          <td>
            <p>{{ singer.country.lang }}</p>
          </td>
          <td>
            <p>{{ singer.style.name }}</p>
          </td>
        </tr>
      </table>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    query: { type: String } // 传过来的搜索参数
  },
  data () {
    return {
      searchType: '专辑', // 搜索类型
      searchParams: '', // 本组件的搜索参数
      AlbumData: [], // 搜索到的专辑数据
      musicData: [], // 歌曲数据
      singerData: []
    }
  },
  methods: {
    // 改变当前播放的音乐
    changeMusic (music) {
      this.$store.dispatch('changeMusic', {
        name: music.name,
        path: music.music[0].path,
        singer: music.singer.name,
        img: music.album.img
      })
    },
    // 使用本组件的参数搜索
    async viewData (e) {
      // 如果e的code不是Enter，说明是通过点击li发起的请求。
      if (e.target === e.currentTarget && e.code !== 'Enter') return
      if (e.code !== 'Enter') {
        this.searchType = e.target.innerText
        const lis = e.currentTarget.children
        for (let i = 0; i < lis.length; i++) {
          if (lis[i] !== e.target) {
            lis[i].classList.remove('now-type')
          } else {
            lis[i].classList.add('now-type')
          }
        }
      }
      let res = null
      if (this.searchType === '歌曲') {
        res = await this.$http.get('musicList', {
          params: { name: this.searchParams }
        })
        this.musicData = res.data
      } else if (this.searchType === '歌手') {
        res = await this.$http.get('singerList', {
          params: { name: this.searchParams }
        })
        this.singerData = res.data
      } else {
        res = await this.$http.get('albumList', {
          params: { name: this.searchParams }
        })
        this.AlbumData = res.data
      }
    },
    // 搜索
    async search () {
      const res = await this.$http.get('albumList', {
        params: { name: this.query }
      })
      this.AlbumData = res.data
    }
  },
  created () {
    this.search()
    this.searchParams = this.query
  }
}
</script>

<style>
.searchData {
  min-height: 100%;
}
.searchData > .search-input {
  height: 225px;
  width: 100%;
  background-image: url(../assets/imgs/searchBG.jpg);
}
.search-input > input {
  position: absolute;
  top: 155px;
  left: 50%;
  margin-left: -250px;
  width: 500px;
  height: 40px;
  padding-left: 1.5em;
}
.searchData > article {
  margin: 50px 0 50px 0;
}
.searchData > article > figure {
  display: flex;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.searchData figure:hover {
  box-shadow: 0 0 10px #999;
}
.searchData > article img {
  width: 120px;
}
.searchData .item-description {
  padding: 5px;
}
.search-input>.search-type {
  width: 200px;
  height: 20px;
  margin: 0 auto;
  padding-top: 180px;
}
.search-type>li {
  display: inline-block;
  margin-right: 25px;
  color: azure;
  cursor: pointer;
}
.search-type>li.now-type {
  color: #EEE75D;
}
/* table */
.search-table {
  margin-left: 50px;
}
.search-table.music-table {
  width: 1100px;
  margin: 50px auto;
}
.search-table td {
  min-width: 310px;
  height: 50px;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #42b983;
  text-align: center;
}
.search-table td>p {
  display: inline-block;
  cursor: pointer;
}
.search-table td>p:hover {
  color: #42b983;
}
.singer-table td {
  min-width: 200px;
}
</style>
