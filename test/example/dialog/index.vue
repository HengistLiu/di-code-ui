<template>
  <div>
    <dc-button @click="openDialog">打开对话框</dc-button>
  </div>
</template>

<script>
export default {
  methods: {
    openDialog () {
      this.$dialog({
        content: '删除后不可撤回操作！\n您是否确定删除该指南?',
        handlers: [
          {
            label: '确定删除',
            handler: ({ close }) => {
              close()
            }
          }, {
            label: '取消',
            handler: ({ close }) => {
              close()
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
