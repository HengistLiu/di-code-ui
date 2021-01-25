<!-- 弹窗基础组件，主要参数：isVisible-控制展示与否的变量名，title-弹窗名；内容通过插槽展示 -->
<template>
  <transition name='messageBox-fade'>
    <div id="messageBox"
         :class="{
           'messageBox': true,
           'messageBox--default': !draggable,
           'messageBox--drag': draggable
         }"
         ref="box"
         :style="boxContainerStyle"
         v-if="!destroyOnClose || visible"
         v-show="visible"
         @click.self="clickGreyHandler"
         @mousedown="dragStartHandler"
         @mousemove="dragHandler"
         @mouseup="dragEndHandler"
         @mouseleave="dragEndHandler">
      <div class="messageBox__main"
           :style="boxStyle"
      >
        <div class="messageBox__header">
          <slot name="header" :close="closeHandler"></slot>
          <template v-if="!$scopedSlots['header']">
            <div class="messageBox__header__title" v-if="title">{{title}}</div>
            <span class="messageBox__close_btn" @click="closeHandler" v-if="!hideClose">
              <i class="dc-iconfont dc-icon-close"></i>
            </span>
          </template>
        </div>
        <div class="messageBox__content">
          <!-- 给插槽传值：关闭方法 -->
          <slot :opers="{ close: closeHandler }"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'dc-message-box',
  props: {
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '340px'
    },
    radius: {
      type: String,
      default: '8px'
    },
    zIndex: {
      type: Number,
      default: 999999
    },
    offsetY: {
      type: String,
      default: '30vh'
    },
    offsetX: {
      type: String,
      default: 'unset'
    },
    visible: Boolean,
    draggable: Boolean,
    hideClose: Boolean
  },
  computed: {
    boxContainerStyle () {
      return Object.assign({
        zIndex: this.zIndex
      }, this.draggable
        ? {
          cursor: this.isMoving ? 'pointer' : 'unset',
          top: this.offset.y + 'px',
          left: this.offset.x + 'px'
        }
        : {
        }
      )
    },
    boxStyle () {
      return {
        width: this.width,
        marginTop: this.draggable ? 'unset' : this.offsetY,
        borderRadius: this.radius
      }
    }
  },
  data () {
    return {
      offset: {
        x: 0,
        y: 0
      },
      offsetD: {},
      isMoving: false
    }
  },
  methods: {
    dragStartHandler (e) {
      if (this.draggable) {
        this.isMoving = true
        this.offsetD = {
          y: e.y - this.offset.y,
          x: e.x - this.offset.x
        }
      }
    },
    dragHandler (e) {
      if ((e.y === 0 && e.x === 0) || !this.isMoving) return
      let d = 30
      let length = this.$refs['box'].clientHeight
      let width = this.$refs['box'].clientWidth
      let screenLength = window.innerHeight - d
      let screenWidth = window.innerWidth - d
      let newY = e.y - this.offsetD.y
      let newX = e.x - this.offsetD.x
      this.offset = {
        y: newY < d ? d : newY + length > screenLength ? screenLength - length : newY,
        x: newX < d ? d : newX + width > screenWidth ? screenWidth - width : newX
      }
    },
    dragEndHandler (e) {
      if (this.draggable) {
        this.isMoving = false
        this.offsetD = {}
      }
    },
    clickGreyHandler () {
      this.$emit('clickGreyHandler', () => {
        this.$emit('update:visible', false)
      })
    },
    closeHandler () {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    initDrag () {
      if (!this.draggable) return
      const target = this.$refs['box']
      target.style.top = this.offsetY
      target.style.left = this.offsetX === 'unset'
        ? `calc(100vh - ${this.width})`
        : this.offsetX
      this.offset = {
        x: target.offsetLeft,
        y: target.offsetTop
      }
    }
  },
  mounted () {
    this.initDrag()
  }
}
</script>

<style lang="scss" scoped>
/* 渐进动画 */
.messageBox-fade {
  @include setTransition('fade', .3s);
}
/* 透明灰色背景 */
.messageBox {
  user-select: none;
  &--default {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: $BG-SHADE-DARK;
    .messageBox__main {
      position: relative;
      background-color: $BG-LIGHTER;
      margin: 0 auto 0 auto;

      box-shadow: $SHADOW-LIGHT;
      border: 1px solid $BORDER-LIGHT;
    }
  }
  &--drag {
    position: fixed;
    top: 0px;
    left: 0px;
    .messageBox__main {
      position: relative;
      background-color: $BG-LIGHTER;
      // margin: 0 auto 0 auto;

      box-shadow: $SHADOW-LIGHT;
      border: 1px solid $BORDER-LIGHT;
    }
  }
  /* 弹窗标题 */
  &__header {
    text-align: left;
    padding: 8px 10px;
    @extend %clearfix;
    // border-bottom: 1px solid $BORDER-LIGHT;
    &__title {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      color: $PRIMARY;

      vertical-align: middle;
      user-select: none;
      &::before {
        content: "";
        display: inline-block;
        width: 20px;
        height: 8px;
        background-color: $PRIMARY;
        border-radius: 4px;
        margin-right: 8px;
        margin-top: -4px;
        vertical-align: middle;
      }
    }
  }
  /* 关闭按钮 */
  &__close_btn {
    font-size: 14px;
    font-weight: 600;
    float: right;
    line-height: 22px;
    cursor: pointer;
    i {
      color: $BG-DARK;
      transition: color .2s;
      &:hover {
        color: $DANGER;
      }
    }
  }
  /* 弹窗主体内容区 */
  &__content {
    margin-bottom: 10px;
    min-height: 120px;
    padding: 5px 10px;
    // background-color: $BG-WHITE;
  }
}
</style>
