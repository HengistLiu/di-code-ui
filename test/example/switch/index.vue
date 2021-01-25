<template>
  <div>
    <dc-switch
      :value="value"
      :options="options"
      :width="300"
      radius="3px"
      :bgStyle="{
        backgroundColor: '#eee'
      }"
      dot
      @update="updateHandler"></dc-switch>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 1,
      options: [
        { label: '同意', value: 1 },
        { label: '中立', value: 2, disabled: true },
        { label: '不同意', value: 3 }
      ]
    }
  },
  methods: {
    updateHandler (val) {
      this.value = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
