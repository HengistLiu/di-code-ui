<!-- 头像组件 -->
<template>
  <img
    :class="{
      'dc-avatar': true,
      'dc-avatar--animation': animation
    }"
    :src="avatarUrl"
    :style="avatarStyle"
    :alt="alt"
    draggable="false"
    @click.stop="$emit('click')"
    @error="isFirstHandle && errorHandler()"
  />
</template>

<script>
import Colors from '@static/css/color.js'

export default {
  name: 'dc-avatar',
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
    animation: Boolean,
    radius: {
      type: String,
      default: '50%'
    }
  },
  computed: {
    avatarUrl () {
      const match = new RegExp('^' + this.pre)
      return this.isShowDefault
        ? this.defaultImage
        : this.url
          ? `${this.host}${this.namespace}${this.pre}${this.url.replace(match, '')}`
          : this.defaultImage
            ? this.defaultImage
            : null
    },
    avatarStyle () {
      return {
        width: this.width,
        height: this.height,
        border: this.outline
          ? typeof (this.outline) === 'string'
            ? this.outline
            : `2px solid ${Colors.borderColor}`
          : 'none',
        boxShadow: this.shadow ? `0px 0px 5px ${Colors.shadowColor}` : 'unset',
        borderRadius: this.radius,
        cursor: this.isImageEvent ? 'pointer' : 'default'
      }
    }
  },
  data () {
    return {
      isFirstHandle: true,
      isShowDefault: false,
      isImageEvent: false
    }
  },
  methods: {
    errorHandler () {
      this.isFirstHandle = false
      if (this.defaultImage) {
        this.isShowDefault = true
      }
    }
  },
  created () {
    // 判断父标签是否监听点击事件，是则添加点击手势
    this.isImageEvent = this.$options._parentListeners != null &&
      this.$options._parentListeners.click != null
  }
}
</script>

<style lang="scss" scoped>
.dc-avatar {
  vertical-align: middle;
  position: relative;
}
.dc-avatar--animation:hover {
  animation: dc-avatar-fade infinite 1s;
}
@keyframes dc-avatar-fade {
  from {
    box-shadow: $SHADOW;
  }
  50% {
    box-shadow: $SHADOW-DARK;
  }
  to {
    box-shadow: $SHADOW;
  }
}
</style>
