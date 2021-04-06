<template>
  <div class="my-music">
    {{$store.state.user}}
  </div>
</template>

<script>
export default {
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
</style>
