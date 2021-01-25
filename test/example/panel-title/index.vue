<template>
  <div>
    <dc-panel>
      <template slot="operations">
        <dc-panel-button icon="dc-iconfont dc-icon-chenggong" type="default" disabled>
          成功操作
        </dc-panel-button>
        <dc-panel-button icon="dc-iconfont dc-icon-jinggao" type="danger">
          危险操作
        </dc-panel-button>
      </template>
      <dc-panel-title
        type="success"
        line-align="center"
        align="left">测试车库</dc-panel-title>
      内容
    </dc-panel>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
