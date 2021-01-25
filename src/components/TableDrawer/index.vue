<template>
  <div>
    <slot :row="row"
          :index="index"
          :drawer="drawer"/>
  </div>
</template>

<script>
export default {
  name: 'dc-table-drawer',
  inject: [ 'row', 'index', 'drawer' ],
  props: {
    only: {
      type: Boolean
    },
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
