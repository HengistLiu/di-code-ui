<template>
  <div>
    {{value}}
    <dc-level :total="10" :value="value" isEdit @change="changeHandler"></dc-level>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 5
    }
  },
  methods: {
    changeHandler (val) {
      this.value = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
