<template>
  <div>
    <dc-select :dataList="list" :curVal="target"></dc-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        { label: '这是测试一', value: 1 },
        { label: '测试二', value: 2 },
        { label: '三阿萨德话分开', value: 3 },
        { label: '四按时', value: 4 }
      ],
      target: 1
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
