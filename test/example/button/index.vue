<template>
  <div class="main">
    <dc-button size="mini" hump reversed icon="dc-iconfont dc-icon-chenggong">
      测试<span slot="tips">提示信息</span>
    </dc-button>
    <dc-button type="success" :loading="isLoading" size="small" hump reversed icon="dc-iconfont dc-icon-chenggong">测试</dc-button>
    <dc-button type="warning" size="middle" hump reversed icon="dc-iconfont dc-icon-chenggong">测试</dc-button>
    <dc-button type="danger" size="big" hump icon="dc-iconfont dc-icon-chenggong">测试</dc-button>
    <dc-button type="info" hump @click="isLoading = !isLoading">加载切换</dc-button>
    <dc-button type="behave" hump :loading="isLoading">测试</dc-button>
    <dc-button disabled hump size="big" icon="dc-iconfont dc-icon-chenggong">测试</dc-button>
    <dc-button  reversed
                focus
                noBorder
                type="warning"
                use-tips
                tipsPanelColor="pink">
      <div slot="tips">
        <ul>
          <li>测试一</li>
          <li>测试二</li>
          <li>测试三</li>
        </ul>
      </div>
      <span>测试</span>
    </dc-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    font-size: 25px;
  }
</style>
