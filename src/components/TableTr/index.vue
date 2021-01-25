<!-- 该组件主要用于派发相应表格行数据 -->
<template>
  <tr>
    <slot></slot>
  </tr>
</template>

<script>
export default {
  name: 'dc-table-tr',
  // 派发table传过来的数据给td
  provide () {
    return {
      row: this.row,
      index: this.index,
      drawer: {
        taggle: this.taggle
      }
    }
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      required: true
    },
    tableKey: {
      type: String
    },
    taggleDrawer: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    taggle () {
      this.taggleDrawer(this.row[this.tableKey].toString().replace('drawer-', ''))
    }
  }
}
</script>

<style scoped>

</style>
