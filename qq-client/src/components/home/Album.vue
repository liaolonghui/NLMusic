<template>
  <div class="album-list">
    <nav class="album-nav">
      <ul>
        <li
          v-for="(img, i) in topImgs"
          :key="i"
          :ref="i"
          :class="{
            active: i === index,
            near: i + 1 === index || i - 1 === index
          }"
        >
          <img
            :src="img"
            alt="topImg"
            @click="$router.push('/home/album/605944d60cad5329e075f0a2')"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data () {
    return {
      topImgs: [], // 图片
      index: 0 // 记录当前位置
    }
  },
  methods: {
    // 轮播动画
    topImgsChange () {
      if (this.index > 9) {
        this.index = 0
      } else if (this.index < 0) {
        this.index = 9
      }
      // 处理当前
      this.$refs[this.index][0].style.transform = 'translateX(250px) scale(1)'
      // 处理近邻
      if (this.index === 9) {
        this.$refs[8][0].style.transform = 'translateX(-35px) scale(0.85)'
        this.$refs[0][0].style.transform = 'translateX(535px) scale(0.85)'
      } else if (this.index === 0) {
        this.$refs[9][0].style.transform = 'translateX(-35px) scale(0.85)'
        this.$refs[1][0].style.transform = 'translateX(535px) scale(0.85)'
      } else {
        this.$refs[this.index - 1][0].style.transform =
          'translateX(-35px) scale(0.85)'
        this.$refs[this.index + 1][0].style.transform =
          'translateX(535px) scale(0.85)'
      }
      // 处理远邻
      for (let i = 1; i <= 3; i++) {
        if (this.index - 1 - i >= 0) {
          this.$refs[this.index - 1 - i][0].style.transform =
            'translateX(-500px) scale(0.85)'
        } else {
          const num = 10 + this.index - 1 - i
          this.$refs[num][0].style.transform = 'translateX(-500px) scale(0.85)'
        }
      }
      for (let j = 1; j <= 4; j++) {
        if (this.index + 1 + j <= 9) {
          this.$refs[this.index + 1 + j][0].style.transform =
            'translateX(1000px) scale(0.85)'
        } else {
          const num = this.index + 1 + j - 9
          this.$refs[num][0].style.transform = 'translateX(1000px) scale(0.85)'
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
  },
  mounted () {
    this.topImgsChange()
    this.topImgTimer = setInterval(() => {
      this.index++
      this.topImgsChange()
    }, 3000)
  },
  destroyed () {
    clearInterval(this.topImgTimer)
  }
}
</script>

<style>
.album-nav {
  width: 1000px;
  height: 220px;
  margin: 30px auto;
  overflow: hidden;
}
.album-nav > ul {
  height: 100%;
  position: relative;
}
.album-nav li {
  position: absolute;
  transition: all 0.5s ease-in;
}
.album-nav li.active {
  z-index: 2;
}
.album-nav li.near {
  z-index: 1;
}
.album-nav li > img {
  display: block;
  width: 500px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
