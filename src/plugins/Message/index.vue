<template>
  <div>
    <transition name="fade">
      <div
      v-show="isShow"
      class="message"
      :style="messageStyle">
      <i :class="{
        'message__icon': true,
        'dc-iconfont': true,
        [icon]: true
      }" :style="iconStyle"></i>
      <div class="message__main">
        <template v-if="isDangerHTML">
          <p v-html="message"></p>
        </template>
        <template v-else>
          <p v-text="message"></p>
        </template>
      </div>
      <i
        v-if="showClose"
        class="message__close dc-iconfont dc-icon-close"
        @click.stop="closeHandler"></i>
    </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    status () {
      const types = ['info', 'success', 'warning', 'error']
      return types.includes(this.type)
        ? this.type
        : 'info'
    },
    icon () {
      let temp = ''
      switch (this.status) {
        case 'info':
          temp = 'dc-icon-xinxi'
          break
        case 'success':
          temp = 'dc-icon-chenggong'
          break
        case 'warning':
          temp = 'dc-icon-ziyuan'
          break
        case 'error':
          temp = 'dc-icon-jinggao'
          break
      }
      return temp
    },
    color () {
      return ({
        'info': 'rgba(117, 117, 117, .8)',
        'success': 'rgba(52, 182, 123, .8)',
        'warning': 'rgba(253, 134, 26, .8)',
        'error': 'rgba(240, 57, 57, .8)'
      })[this.status]
    },
    iconStyle () {
      return {
        color: this.color
      }
    },
    messageStyle () {
      return {
        borderColor: this.color
      }
    }
  },
  data () {
    return {
      isShow: false,
      type: 'info',
      message: '',
      duration: 1500,
      showClose: true,
      isDangerHTML: false,
      timer: null
    }
  },
  methods: {
    closeHandler () {
      this.isShow = false
      this.timer = setTimeout(() => {
        this.remove(this.key)
        clearTimeout(this.timer)
      }, 500)
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  created () {
    this.$nextTick(() => {
      this.isShow = true
    })
    // 如果间隔不为-1才设置自动关闭
    if (this.duration !== -1) {
      this.timer = setTimeout(() => {
        this.closeHandler()
      }, this.duration)
    }
  }
}
</script>
<style lang="scss" scoped>
  .fade {
    &-leave-to {
      opacity: 0;
    }
    @include setTransition('fadeWithTransform', .8s, translateY(-150%));
  }
  .message {
    border: 1px solid;
    border-radius: 6px;
    padding: 6px 0;
    margin: 10px 0;
    position: relative;
    background-color: $BG-WHITE;
    box-shadow: $SHADOW-LIGHT;
    @include setFlex(row, space-around);
    &__icon {
      width: 50px;
      flex: 0 0 auto;
      font-size: 20px;
      text-align: center;
    }
    &__main {
      flex: 1 0 auto;
      color: $TEXT-PRIMARY;
      line-height: 30px;
      font-size: 12px;
    }
    &__close {
      font-size: 14px;
      line-height: 30px;
      color: $TEXT-PLACEHOLDER;
      position: absolute;
      cursor: pointer;
      right: 10px;
      top: 50%;
      transition: all .2s;
      transform: translateY(-50%);
      &:hover {
        color: $TEXT-REGULAR;
      }
    }
  }
</style>
