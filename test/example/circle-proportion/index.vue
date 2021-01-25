<template>
  <div class="main">
    <dc-circle-proportion
      :radius="100"
      :init-value="value"
      outer-color="red"/>
    <button @click="value = 30">变化</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 200
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {}
</style>
