<template>
  <div>
    <dc-tab :curTab="curTab"
            :btnsConfig="[
              { label: '测试', icon: 'dc-iconfont dc-icon-shubiao' },
              { label: '测试二', children: [
                { label: '测试三', icon: 'dc-iconfont dc-icon-shubiao' },
                { label: '测试四', icon: 'dc-iconfont dc-icon-shubiao' }
              ] }
            ]"
            @changeHandler="(val) => curTab = val">
      <div v-if="curTab === '测试'" :key="1">
        测试
      </div>
      <div v-else :key="2">
        测试二
      </div>
    </dc-tab>
  </div>
</template>

<script>
export default {
  data () {
    return {
      curTab: '测试'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
