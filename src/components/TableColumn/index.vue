<!-- 表格内的td组件用于获取数据并展示插槽 -->
<template>
  <td class="table__td"
       :colspan="colspan"
       :style="{
        textAlign: align,
        overflow: overflow
      }"
  >
    <!-- 如果有默认内容则直接展示 -->
    <span v-if="!isHaveSlots">
      {{cellValue}}
    </span>
    <!-- 传递该行数据 -->
    <slot v-show="isHaveSlots"
          :row="row"
          :index="index"
          :drawer="drawer"/>
  </td>
</template>

<script>
import methods from '@/mixins/methods.js'
export default {
  name: 'dc-table-column',
  inject: [ 'row', 'index', 'drawer' ],
  mixins: [ methods ],
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: -1
    },
    prop: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'center',
      validator: (val) => ['left', 'center', 'right'].includes(val)
    },
    colspan: {
      type: Number,
      default: 1
    },
    overflow: {
      type: String,
      default: 'hidden',
      validator: (val) => ['hidden', 'unset', 'auto', 'scroll'].includes(val)
    },
    sorter: {
      type: [Boolean, Function]
    },
    filter: {
      type: Array,
      default: () => []
    },
    value: {
      type: Number,
      default: -1
    }
  },
  computed: {
    isHaveSlots () {
      return this.$scopedSlots['default']
    },
    cellValue () {
      return typeof (this.row) !== 'undefined' &&
          (this.prop in this.row)
        ? this.row[this.prop]
        : ''
    }
  },
  methods: {
    GenNonDuplicateID (randomLength) {
      return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
    },
    filterChangeHandler (val) {
      this.$emit('filterChangeHandler', val)
    }
  },
  destroyed () {
    if (!this.label) return
    this.$dispatch('dc-table', 'deleteColumn')
  },
  mounted () {
    if (!this.label) return
    this.$dispatch('dc-table', 'addColumn')
  },
  watch: {
    label: {
      handler: function (newVal, oldVal) {
        this.$dispatch('dc-table', 'updateColumn')
      },
      deep: false,
      immediate: false
    },
    value: {
      handler: function (newVal, oldVal) {
        this.$dispatch('dc-table', 'updateColumn')
      },
      deep: false,
      immediate: false
    }
  }
}
</script>

<style scoped>
  .table__td {
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 3px;
  }
</style>
