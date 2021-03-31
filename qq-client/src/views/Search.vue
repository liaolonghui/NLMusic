<template>
  <div class="searchData">
    <header class="search-input">
      <input
        type="text"
        placeholder="搜索音乐、专辑、歌手、用户"
        v-model="searchParams"
        @keydown.enter="viewData"
      />
    </header>
    <article>
      <figure
        v-for="item in searchData"
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
  </div>
</template>

<script>
export default {
  props: {
    query: { type: String } // 传过来的搜索参数
  },
  data () {
    return {
      searchParams: '', // 本组件的搜索参数
      searchData: [] // 搜索到的数据
    }
  },
  methods: {
    // 使用本组件的参数搜索
    async viewData () {
      const res = await this.$http.get('albumList', {
        params: { name: this.searchParams }
      })
      this.searchData = res.data
    },
    // 搜索
    async search () {
      const res = await this.$http.get('albumList', {
        params: { name: this.query }
      })
      this.searchData = res.data
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
  height: 150px;
  width: 100%;
  background-image: url(../assets/imgs/searchBG.jpg);
}
.search-input > input {
  position: absolute;
  top: 125px;
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
</style>
