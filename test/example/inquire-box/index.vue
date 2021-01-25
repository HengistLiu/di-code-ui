<template>
  <div>
    <dc-button @click="isShowInquireBox = true">打开弹出窗{{isShowInquireBox}}</dc-button>
    <dc-inquire-box
      :visible.sync="isShowInquireBox"
      :destroy-on-close="false"
      :btnsConfig="[
        {
          label: '取消',
          handler: ({ close }) => {
            close()
          }
        }
      ]"
      radius="10px"
      @clickGreyHandler="clickGreyHandler">
      <dc-message-box
        :visible.sync="isShowMessageBox"
        :destroy-on-close="false"
        radius="10px"
        @clickGreyHandler="clickGreyHandler">
        <dc-input v-model="test"></dc-input>
      </dc-message-box>
      <dc-button @click="isShowMessageBox = true">打开内层弹出窗</dc-button>
      <dc-button @click="isShowMessageBox = false">关闭内层弹出窗</dc-button>
    </dc-inquire-box>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowMessageBox: false,
      isShowInquireBox: true,
      test: 'test'
    }
  },
  methods: {
    clickGreyHandler (close) {
      close(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
