<template>
  <div>
    <dc-partition
      ref="partition"
      label="测试"
      icon="dc-iconfont dc-icon-level"
      cancel-init-height
      noTransition>
      <dc-panel-title type="warning" en="TEXT">测试</dc-panel-title>
      <ul>
        <li v-for="(item) in list"
            :key="item.value">
          {{item.label}}
        </li>
      </ul>
      <textarea v-model="content"></textarea>
    </dc-partition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      content: ''
    }
  },
  created () {
    setTimeout(() => {
      this.list = [
        { label: '一', value: 1 },
        { label: '二', value: 2 },
        { label: '三', value: 3 },
        { label: '四', value: 4 },
        { label: '一', value: 11 },
        { label: '二', value: 12 },
        { label: '三', value: 13 },
        { label: '四', value: 14 },
        { label: '一', value: 21 },
        { label: '二', value: 22 },
        { label: '三', value: 23 },
        { label: '四', value: 24 },
        { label: '一', value: 31 },
        { label: '二', value: 32 },
        { label: '三', value: 33 },
        { label: '四', value: 34 }
      ]
      this.$refs['partition'].updateHeight()
    }, 500)
  }
}
</script>

<style lang="scss" scoped>

</style>
