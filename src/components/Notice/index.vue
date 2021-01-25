<!-- 复用组件 -->
<template>
  <div class="notice"
       :style="{
         fontSize: size + 'px',
         color: color,
         fontWeight: weight
       }">
    <span class="notice__main"
          :style="{
            lineHeight: lineHeight
          }">
      <slot/>
    </span>
  </div>
</template>

<script>
export default {
  name: 'dc-notice',
  props: {
    color: {
      type: String,
      default: '#CCCCCC'
    },
    size: {
      type: Number,
      default: 15
    },
    weight: {
      type: Number,
      default: 300
    },
    lineHeight: {
      type: String,
      default: '2'
    }
  },
  data () {
    return {
      slots: this.$slots
    }
  },
  methods: {
    filterContent () {
      const components = this.$slots.default
      this.$slots.default = components.filter(slot => {
        return slot.componentOptions == null
      })
    }
  },
  created () {
    this.filterContent()
  },
  watch: {
    slots () {
      this.filterContent()
    }
  }
}
</script>

<style lang="scss" scoped>
  .notice {
    text-align: center;
    white-space: nowrap;
    cursor: default;
    user-select: none;
    &__main {
      position: relative;
      vertical-align: middle;
      &::before,
      &::after {
        content: '';
        width: 20px;
        height: 1px;
        background-color: $BORDER;
        display: inline-block;
        vertical-align: middle;
        margin: 0 30px;
      }
    }
  }
</style>
