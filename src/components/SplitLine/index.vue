<template>
  <div class="line" :style="lineStyle">
    <div v-if="!disabled"
         class="line__focus"
         :style="focusLineStyle"
         draggable="true"
         @dragstart="dragstartHandler"
         @drag="dragHandler"
         @dragend="dragendHandler"></div>
  </div>
</template>

<script>
export default {
  name: 'dc-split-line',
  props: {
    offset: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: 'column'
    },
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: 0
    },
    defaultColor: {
      type: String,
      default: '#e9ebef'
    },
    activeColor: {
      type: String,
      default: '#31ac75'
    },
    zIndex: {
      type: Number,
      default: 0
    },
    fullLength: {
      type: String,
      default: '100%'
    },
    disabled: Boolean
  },
  computed: {
    moveDir () {
      return this.type === 'column' ? 'x' : 'y'
    },
    lineStyle () {
      return {
        width: this.type === 'column' ? '1px' : this.fullLength,
        height: this.type !== 'column' ? '1px' : this.fullLength,
        cursor: this.disabled
          ? 'default'
          : this.type === 'column' ? 'e-resize' : 'n-resize',
        backgroundColor: this.defaultColor,
        zIndex: this.zIndex
      }
    },
    focusLineStyle () {
      return {
        width: this.type === 'column' ? '3px' : this.fullLength,
        height: this.type !== 'column' ? '3px' : this.fullLength,
        left: this.type === 'column' ? '-1px' : 'unset',
        top: this.type !== 'column' ? '-1px' : 'unset',
        backgroundColor: this.activeColor,
        opacity: this.isDragging ? '.6' : '0'
      }
    }
  },
  data () {
    return {
      isDragging: false,
      origin: 0,
      aim: 0,
      oldOffset: 0
    }
  },
  methods: {
    dragendHandler (e) {
      this.isDragging = false
    },
    dragstartHandler (e) {
      this.oldOffset = this.offset
      this.origin = e[this.moveDir]
      this.isDragging = true
      // 隐藏拖拽图片
      let img = new Image()
      img.src = ''
      e.dataTransfer.setDragImage(img, 0, 0)
    },
    dragHandler (e) {
      if (this.disabled) return
      if (e[this.moveDir] === 0) return
      this.aim = e[this.moveDir]
      const temp = this.oldOffset + this.aim - this.origin
      const offset = temp < this.min
        ? this.min
        : temp > this.max
          ? this.max
          : temp
      this.$emit('update:offset', offset)
    }
  }
}
</script>

<style lang="scss" scoped>
.line {
  position: relative;
  z-index: 1;
  transition: all .1s;
  &__focus {
    position: absolute;
    opacity: 0;
    transition: all .1s;
  }
  &:hover {
    .line__focus {
      opacity: .6 !important;
    }
  }
}
</style>
