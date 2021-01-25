<template>
  <div class="dc-partition">
    <!-- 图标 -->
    <span :class="{
            'dc-partition__icon': true,
            'icon--public--round': true,
            'dc-partition__icon--pointer': !!label}"
          @click="label && (isHideContainer = !isHideContainer)"
          :style="iconStyle"
          ><i :class="icon"></i></span>
    <!-- 标题 -->
    <transition name="label-fade">
      <span v-if="isHideContainer"
            class="dc-partition__label"
            >{{label}}</span>
    </transition>
    <!-- 主要内容展示区 -->
    <div
      ref="content"
      :class="{
        'dc-partition__container': true,
        'dc-partition__container--canHide': !!label,
        'dc-partition__container--hide': isHideContainer
      }"
      :style="{
        maxHeight: this.noTransition ? 'unset' : maxHeight
      }"
    >
      <div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
import Colors from '@static/css/color.js'

export default {
  name: 'dc-partition',
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'warning'
    },
    cancelInitHeight: Boolean,
    noTransition: Boolean
  },
  computed: {
    theme () {
      const types = ['success', 'warning', 'danger', 'behave', 'info']
      return types.indexOf(this.type) === -1
        ? 'info'
        : this.type
    },
    iconStyle () {
      const types = Colors.types
      const colors = Colors.colors
      let index = types.indexOf(this.theme)
      return {
        color: colors[index],
        border: `1px solid ${colors[index]}`
      }
    }
  },
  data () {
    return {
      isHideContainer: false,
      maxHeight: 'unset'
    }
  },
  methods: {
    updateHeight () {
      this.$nextTick(() => {
        const { clientHeight } = this.$refs['content']
        this.maxHeight = clientHeight + 'px'
      })
    }
  },
  mounted () {
    !this.cancelInitHeight && this.updateHeight()
  }
}
</script>

<style lang="scss" scoped>

.label-fade {
  @include setTransition('fadeWithTransform', .3s, translateY(100%));
}
.dc-partition {
  padding: 25px;
  margin-bottom: -25px;
  /* background-color: red; */
  position: relative;
  &__icon {
    background-color: $BG-WHITE;

    position: absolute;
    top: 0px;
    left: 0px;
    &--pointer {
      cursor: pointer;
    }
  }
  /* 标题 */
  &__label {
    font-weight: 600;
    color: $TEXT-PRIMARY;
    font-size: 18px;
    position: absolute;
    top: 12px;
    left: 65px;
    user-select: none;
  }
  /* 内容区 */
  &__container {
    padding: 20px 20px 20px 35px;
    border-left: 3px solid $BORDER-LIGHT;
    min-height: 200px;
    overflow: hidden;
    transition: all 0.5s;
    &--canHide {
      min-height: unset;
    }
    &--hide {
      max-height: 10px !important;
      & > div {
        opacity: 0;
        transition: all 0.5s;
      }
    }
  }
}
</style>
