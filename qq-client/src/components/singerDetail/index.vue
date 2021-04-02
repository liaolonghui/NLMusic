<template>
  <div v-if="singer._id">
    <p>{{singer.name}}</p>
    <p>{{singer.sex}}</p>
    <p>{{singer.description}}</p>
    <p>{{singer.country.country}}</p>
    <p>{{singer.country.lang}}</p>
    <p>{{singer.style.name}}</p>
    <p>{{singer.style.description}}</p>
    <img :src="singer.img" alt="SingerImg">
  </div>
</template>

<script>
export default {
  props: {
    singerID: { type: String }
  },
  data () {
    return {
      singer: {}
    }
  },
  methods: {
    async getSingerDetail () {
      const res = await this.$http.get(`singer/${this.singerID}`)
      this.singer = res.data
    }
  },
  created () {
    this.getSingerDetail()
  }
}
</script>
