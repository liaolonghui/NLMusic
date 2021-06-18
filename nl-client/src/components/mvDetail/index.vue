<template>
  <div class="mv-detail">
    <video :src="MV.video[0].path" controls loop></video>
    <h3>{{ MV.name }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String }
  },
  data () {
    return {
      MV: {
        video: [{}]
      }
    }
  },
  methods: {
    async getMV () {
      const res = await this.$http.get(`mv/${this.id}`)
      this.MV = res.data
    }
  },
  created () {
    this.getMV()
  }
}
</script>

<style>
  .mv-detail {
    width: 1000px;
    margin: 30px auto;
  }
  .mv-detail>video {
    width: 100%;
    outline: none;
  }
  .mv-detail>h3 {
    padding: 10px 0;
  }
</style>
