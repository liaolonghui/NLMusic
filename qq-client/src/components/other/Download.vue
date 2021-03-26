<template>
  <div class="download">
    <section class="section" :class="'bg'+Active">
      <h1>南理音乐 PC客户端 海量高品质曲库尽享</h1>
      <button class="btn">立刻下载</button>
      <ul class="items">
        <li :class="{'active': Active===1}" @click="changeActive(1)">PC版</li>
        <li :class="{'active': Active===2}" @click="changeActive(2)">Mac版</li>
        <li :class="{'active': Active===3}" @click="changeActive(3)">iPhone版</li>
        <li :class="{'active': Active===4}" @click="changeActive(4)">Android版</li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Active: 1
    }
  },
  methods: {
    changeActive (index) {
      this.Active = index
    }
  }
}
</script>

<style>
  .bg1 {
    background-image: url(../../assets/imgs/bg1.jpg);
    background-size: auto 560px;
  }
  .bg2 {
    background-image: url(../../assets/imgs/bg2.jpg);
    background-size: auto 560px;
  }
  .bg3 {
    background-image: url(../../assets/imgs/bg3.jpg);
    background-size: auto 560px;
  }
  .bg4 {
    background-image: url(../../assets/imgs/bg4.jpg);
    background-size: auto 560px;
  }

  div.download {
    min-height: 580px;
    background-color: #333;
  }
  .download>.section {
    height: 560px;
    padding: 10px;
    color: white;
  }
  .download h1 {
    font-size: 30px;
    width: 500px;
    margin: 100px auto;
    word-break: keep-all;
    text-align: center;
  }
  .download h1::first-line {
    font-size: 50px;
  }
  .download .btn {
    width: 270px;
    height: 70px;
    border-radius: 40px;
    background-color: #42b983;
    color: white;
    font-size: 25px;
    position: absolute;
    top: 350px;
    left: 50%;
    margin-left: -135px;
  }
  .items {
    width: 1000px;
    margin: 200px auto;
    border-top: 1px solid #ccc;
  }
  .items li {
    float: left;
    width: 100px;
    border-top: 3px solid transparent;
    padding-top: 20px;
    margin-left: 75px;
    margin-right: 75px;
    color: #aaa;
    text-align: center;
    font-size: 25px;
    cursor: pointer;
  }
  .items li:hover {
    color: white;
  }
  .items li.active {
    border-top: 3px solid #fff;
    color: white;
  }
</style>
