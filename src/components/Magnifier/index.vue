<!-- 头像组件 -->
<template>
  <div
    :class="{
      'dc-magnifier': true,
      'dc-magnifier--control': isControl
    }"
    :style="containerStyle">
    <img
      class="dc-magnifier__container"
      :src="imageUrl"
      :style="imageStyle"
      :alt="alt"
      :draggable="draggable"
      @click.stop="clickHandler"
      @error="isFirstHandle && errorHandler()"
    />
    <transition name="fade">
    <div
      class="control__panel"
      v-if="isControl && isShowControlPanel"
      @click="closeControlPanel">
      <img
        ref="control__panel__image"
        class="control__panel__image"
        :src="imageUrl"
        :style="controlImageStyle"
        :alt="alt"
        :draggable="false"
        @click.stop="()=>{}"
        @error="isFirstHandle && errorHandler()"
        @mousewheel.stop="wheelHandler"
        @mousedown.stop="startMove"
        @mousemove="move"
        @mouseup.stop="endMove"
      />
      <div class="control__panel__tips">
        <span><i class="dc-iconfont dc-icon-zhuawonengli"></i>&nbsp;拖动图片改变观察位置</span>
        <span><i class="dc-iconfont dc-icon-shubiao"></i>&nbsp;鼠标滑轮滚动改变图片大小</span>
      </div>
      <div class="control__panel__buttons">
        <span
          v-if="isChangeSetting"
          @click.stop="initSetting">
          <i class="dc-iconfont dc-icon-zhongzhi"></i>
        </span>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import Colors from '@static/css/color.js'

export default {
  name: 'dc-magnifier',
  props: {
    host: {
      type: String,
      default: ''
    },
    namespace: {
      type: String,
      default: ''
    },
    pre: {
      type: String,
      default: '/static'
    },
    url: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: 'unset'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: 'auto'
    },
    alt: {
      type: String,
      default: ''
    },
    defaultImage: {},
    outline: [Boolean, String],
    shadow: Boolean,
    draggable: Boolean,
    control: Boolean,
    fluid: Boolean,
    radius: {
      type: String,
      default: '5px'
    }
  },
  computed: {
    isControl () {
      return this.control
    },
    isChangeSetting () {
      if (this.tempSetting == null) return false
      return Object.keys(this.setting)
        .some(i => {
          if (['isMove'].indexOf(i) !== -1) return false
          return this.setting[i] !== this.tempSetting[i]
        })
    },
    imageUrl () {
      const match = new RegExp('^' + this.pre)
      return this.isShowDefault
        ? this.defaultImage
        : this.url
          ? `${this.host}${this.namespace}${this.pre}${this.url.replace(match, '')}`
          : this.defaultImage
            ? this.defaultImage
            : null
    },
    containerStyle () {
      return {
        width: this.fluid ? '100%' : 'auto',
        maxWidth: this.maxWidth
      }
    },
    imageStyle () {
      return {
        width: this.fluid ? '100%' : this.width,
        height: this.height,
        border: this.outline
          ? typeof (this.outline) === 'string'
            ? this.outline
            : `2px solid ${Colors.borderColor}`
          : 'none',
        boxShadow: this.shadow ? `0px 0px 15px ${Colors.shadow}` : 'unset',
        borderRadius: this.radius
      }
    },
    controlImageStyle () {
      return {
        transform: `translate(${this.setting.dx}px, ${this.setting.dy}px) scale(${this.setting.scale})`,
        cursor: this.setting.isMove ? 'grabbing' : 'grab'
      }
    }
  },
  data () {
    return {
      isShowControlPanel: false,
      isFirstHandle: true,
      isShowDefault: false,
      setting: {
        scale: 1,
        isMove: false,
        dx: 0,
        dy: 0
      },
      tempSetting: null
    }
  },
  methods: {
    initSetting () {
      const controlImage = this.$refs['control__panel__image']
      this.setting = {
        scale: 1,
        isMove: false,
        dx: -controlImage.clientWidth / 2,
        dy: -controlImage.clientHeight / 2
      }
      this.tempSetting = JSON.parse(JSON.stringify(this.setting))
    },
    clickHandler () {
      if (this.isControl) {
        this.openControlPanel()
        this.$nextTick(() => {
          this.initSetting()
        })
      }
      this.$emit('clickHandler')
    },
    openControlPanel () {
      this.isShowControlPanel = true
    },
    closeControlPanel () {
      this.isShowControlPanel = false
    },
    wheelHandler (e) {
      const dy = e.wheelDeltaY
      this.setting.scale += 0.001 * dy
      this.setting.scale = dy > 0
        ? this.setting.scale > 2
          ? 2
          : this.setting.scale
        : this.setting.scale <= 0.3
          ? 0.3
          : this.setting.scale
    },
    errorHandler () {
      this.isFirstHandle = false
      if (this.defaultImage) {
        this.isShowDefault = true
      }
    },
    startMove (e) {
      this.setting.isMove = true
    },
    move (e) {
      const dx = e.movementX
      const dy = e.movementY
      if (this.setting.isMove) {
        this.setting.dx += dx
        this.setting.dy += dy
      }
    },
    endMove (e) {
      this.setting.isMove = false
    }
  }
}
</script>

<style lang="scss" scoped>
.fade {
  @include setTransition('fade', .3s);
}
.dc-magnifier {
  display: inline-block;
  font-size: 0;
  line-height: 0;
  &--control {
    padding: 3px;
    border-radius: 3px;
    transition: all .3s;
    .dc-magnifier__container {
      cursor: pointer;
    }
    &:hover {
      background-color: $BG-SHADE;
    }
  }
  .control__panel {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1002;
    background-color: $BG-SHADE-DARKER;
    // overflow: hidden;
    &__image {
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 5px;
      z-index: 0;
    }
    &__tips {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      font-size: 14px;
      color: $TEXT-WHITE;
      opacity: .6;
      white-space: nowrap;
      span {
        padding: 0 20px;
      }
    }
    &__buttons {
      position: absolute;
      bottom: 30px;
      right: 30px;
      z-index: 1;
      color: $TEXT-WHITE;
      opacity: .6;
      span {
        i {
          font-size: 40px;
          cursor: pointer;
        }
      }
      &:hover {
        opacity: 1;
        span {
          i {
            color: $WARNING;
          }
        }
      }
    }
  }
}
</style>
