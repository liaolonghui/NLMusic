<template>
  <div class="mv-list">
    <figure v-for="mv in mvList" :key="mv._id">
      <div class="img-container">
        <img :src="mv.img" alt="mvIMG" @click="$router.push(`/home/mv/${mv._id}`)">
      </div>
      <p style="margin-top: 5px;">{{mv.name}}</p>
      <i></i>
    </figure>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mvList: []
    }
  },
  methods: {
    async getMVList () {
      const res = await this.$http.get('mvList')
      this.mvList = res.data
    }
  },
  created () {
    this.getMVList()
  }
}
</script>

<style>
  .mv-list {
    width: 1200px;
    margin: 30px auto;
  }
  .mv-list::after {
    display: block;
    content: '';
    clear: both;
    visibility: hidden;
    height: 0;
    line-height: 0;
    font-size: 0;
  }
  .mv-list > figure {
    box-sizing: border-box;
    width: 25%;
    padding: 10px;
    margin: 0;
    float: left;
    position: relative;
  }
  .mv-list .img-container {
    width: 100%;
    height: 150px;
    overflow: hidden;
  }
  .mv-list > figure img {
    display: block;
    width: 100%;
    cursor: pointer;
    transition: transform 0.3s ease-in;
  }
  .mv-list > figure > i {
    opacity: 0;
    width: 60px;
    height: 60px;
    background: url('../../assets/imgs/cover.png') no-repeat;
    background-size: contain;
    position: absolute;
    top: 60px;
    left: 120px;
    transform: scale(0.7);
    transition: all 0.3s ease-in;
    -webkit-transition: all 0.3s ease-in;
    cursor: pointer;
  }
  .mv-list > figure:hover > i {
    opacity: 1;
    transform: scale(1);
  }
  .mv-list > figure:hover img {
    transform: scale(1.2);
  }
</style>
