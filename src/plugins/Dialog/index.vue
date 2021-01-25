<template>
  <dc-inquire-box :visible.sync="isOpenInquireBox"
                  align="center"
                  :btnsConfig="inquireBoxBtnList"
                  @close="closeHandler"
                  @clickGreyHandler="clickGreyHandler">
    <div class="panel__content">
      <p v-for="(item, index) in contentList" :key="index">
        {{item}}
      </p>
    </div>
  </dc-inquire-box>
</template>

<script>
export default {
  computed: {
    contentList () {
      return this.content.split('\n')
    }
  },
  data () {
    return {
      content: '',
      isOpenInquireBox: false,
      inquireBoxBtnList: []
    }
  },
  methods: {
    closeHandler () {
      this.remove()
    },
    clickGreyHandler (close) {
      close()
      this.remove()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isOpenInquireBox = true
    })
  }
}
</script>

<style scoped>
  /* 登录询问框的内容样式 */
  .panel__content > p {
    font-size: 14px !important;
    margin: 14px 0 !important;
  }
</style>
