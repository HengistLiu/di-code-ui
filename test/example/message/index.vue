<template>
  <div>
    <dc-button @click="openMessage">打开消息窗口</dc-button>
  </div>
</template>

<script>
export default {
  methods: {
    openMessage () {
      this.$message({
        message: '这都是什么东西！',
        type: 'success',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
