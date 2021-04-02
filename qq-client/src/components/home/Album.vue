<template>
  <div class="album-list">
    <nav class="album-nav">
      <ul @mouseenter="enterTop" @mouseleave="leaveTop">
        <li
          v-for="(img, i) in topImgs"
          :key="i"
          :ref="i"
          :class="{
            active: i === index,
            near: isNear(i)
          }"
        >
          <img
            :src="img"
            alt="topImg"
            @click="$router.push('/home/album/605944d60cad5329e075f0a2')"
          />
        </li>
        <aside>
          <span @click="toLeft" class="lt">&lt;</span>
          <span @click="toRight" class="gt">&gt;</span>
        </aside>
        <ol>
          <li v-for="(img, i) in topImgs" :key="i" :ref="'li'+i" @mouseenter="changeTopImgs(i)"></li>
        </ol>
      </ul>
    </nav>
    <section>
      <h2 align="center" style="padding-top: 20px;">数字专辑</h2>
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
  data () {
    return {
      topImgs: [], // 图片
      index: 0, // 记录当前位置
      albumList: [] // 全部专辑信息
    }
  },
  methods: {
    // 判断是不是near
    isNear (i) {
      if (this.index === 9) {
        if (i === 0 || i === 8) {
          return true
        } else {
          return false
        }
      } else if (this.index === 0) {
        if (i === 9 || i === 1) {
          return true
        } else {
          return false
        }
      } else {
        if (i + 1 === this.index || i - 1 === this.index) {
          return true
        } else {
          return false
        }
      }
    },
    // getAlbumList
    async getAlbumList () {
      const res = await this.$http.get('albumList')
      if (res.status === 200) {
        this.albumList = res.data
      }
    },
    // 左右切换
    toLeft () {
      this.index--
      this.topImgsChange()
    },
    toRight () {
      this.index++
      this.topImgsChange()
    },
    // 清除定时器
    enterTop () {
      clearInterval(this.topImgTimer)
    },
    leaveTop () {
      this.topImgTimer = setInterval(() => {
        this.index++
        this.topImgsChange()
      }, 2500)
    },
    // 标记
    changeTopImgs (i) {
      this.index = i
      this.topImgsChange()
    },
    // 轮播动画
    topImgsChange () {
      if (this.index > 9) {
        this.index = 0
      } else if (this.index < 0) {
        this.index = 9
      }
      // 处理当前
      this.$refs[this.index][0].style.transform = 'translateX(250px) scale(1)'
      // 让对应标记变色
      for (let j = 0; j < 10; j++) {
        if (j !== this.index) {
          this.$refs['li' + j][0].classList.remove('active')
        } else {
          this.$refs['li' + j][0].classList.add('active')
        }
      }
      // 处理近邻
      if (this.index === 9) {
        this.$refs[8][0].style.transform = 'translateX(-50px) scale(0.8)'
        this.$refs[0][0].style.transform = 'translateX(550px) scale(0.8)'
      } else if (this.index === 0) {
        this.$refs[9][0].style.transform = 'translateX(-50px) scale(0.8)'
        this.$refs[1][0].style.transform = 'translateX(550px) scale(0.8)'
      } else {
        this.$refs[this.index - 1][0].style.transform = 'translateX(-50px) scale(0.8)'
        this.$refs[this.index + 1][0].style.transform = 'translateX(550px) scale(0.8)'
      }
      // 处理远邻
      for (let i = 1; i <= 3; i++) {
        if (this.index - 1 - i >= 0) {
          this.$refs[this.index - 1 - i][0].style.transform = 'translateX(-550px) scale(0.8)'
        } else {
          const num = 10 + this.index - 1 - i
          this.$refs[num][0].style.transform = 'translateX(-550px) scale(0.8)'
        }
      }
      for (let j = 1; j <= 4; j++) {
        if (this.index + 1 + j <= 9) {
          this.$refs[this.index + 1 + j][0].style.transform = 'translateX(1050px) scale(0.8)'
        } else {
          const num = this.index + 1 + j - 10
          this.$refs[num][0].style.transform = 'translateX(1050px) scale(0.8)'
        }
      }
    }
  },
  created () {
    // 给topImgs图片地址
    this.topImgs = new Array(10).fill('')
    this.topImgs = this.topImgs.map((img, i) => {
      if (i === 4 || i === 7) {
        img = require(`../../assets/topImgs/${i}.gif`)
        return img
      } else {
        img = require(`../../assets/topImgs/${i}.jpg`)
        return img
      }
    })
    // 获取全部专辑
    this.getAlbumList()
  },
  mounted () {
    this.topImgsChange()
    this.topImgTimer = setInterval(() => {
      this.index++
      this.topImgsChange()
    }, 2500)
  },
  destroyed () {
    clearInterval(this.topImgTimer)
  }
}
</script>

<style>
.album-list {
  width: 1100px;
  margin: 30px auto;
}
/* nav */
.album-nav {
  width: 100%;
  height: 270px;
  overflow: hidden;
}
.album-nav > ul {
  height: 100%;
  position: relative;
}
.album-nav > ul > li {
  position: absolute;
  transition: all 0.5s linear;
}
.album-nav li.active {
  z-index: 2;
}
.album-nav li.near {
  z-index: 1;
}
.album-nav li > img {
  display: block;
  width: 600px;
  border-radius: 5px;
  cursor: pointer;
}
.album-nav ol {
  overflow: hidden;
  height: 5px;
  width: 500px;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -250px;
}
.album-nav ol > li {
  float: left;
  width: 40px;
  height: 5px;
  margin-left: 10px;
  background-color: #ddd;
  cursor: pointer;
}
.album-nav ol > li.active {
  background-color: #999;
}
.album-nav aside span {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  position: absolute;
  z-index: 6;
  top: 50%;
  margin-top: -25px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  opacity: 0.2;
  transition: opacity 0.3s ease-in-out;
}
.album-nav:hover aside span {
  opacity: 0.9;
}
.album-nav aside span.lt {
  left: 15px;
}
.album-nav aside span.gt {
  right: 15px;
}
/* section */
.album-list>section {
  margin-top: 30px;
  background-color: #fafafa;
}
article.albums {
  display: flex;
  flex-wrap: wrap;
}
article.albums>figure {
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}
article.albums>figure:hover {
  color: #42b983;
  margin-top: 0;
  box-shadow: 0 10px 10px #999;
}
article.albums>figure>img {
  width: 250px;
}
article.albums>figure>p {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
