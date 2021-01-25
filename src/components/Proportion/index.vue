<!-- 比例条(通过/提交)组件 -->
<template>
  <div class="dc-proportion" :style="mainStyle">
    <div class="dc-proportion__container" :style="containerStyle">
      <span v-if="!hideText" class="dc-proportion__text">
        {{value}} / {{total}}
        <template v-if="showRate">
          <span>({{rate.toFixed(2)}}%)</span>
        </template>
      </span>
      <div class="dc-proportion__process">
        <div class="dc-proportion__process--all"
            :style="{
              width: width + 'px'
            }"
        ></div>
        <div class="dc-proportion__process--active"
            :style="activeLineStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Colors from '@static/css/color.js'

export default {
  name: 'dc-proportion',
  props: {
    type: {
      type: String,
      default: 'success'
    },
    align: {
      type: String,
      default: 'left'
    },
    total: {
      type: Number,
      require: true
    },
    value: {
      type: Number,
      require: true
    },
    width: {
      type: Number,
      default: 100
    },
    textDirection: {
      type: String,
      default: 'top'
    },
    hideText: Boolean,
    showRate: Boolean
  },
  computed: {
    realAlign () {
      return ['left', 'center', 'right'].includes(this.align)
        ? this.align
        : 'left'
    },
    direction () {
      return ['top', 'bottom', 'left', 'right'].includes(this.textDirection)
        ? this.textDirection
        : 'top'
    },
    rate () {
      return Math.floor((this.value / this.total) * 1000) * 0.001
    },
    theme () {
      const types = ['success', 'warning', 'danger', 'behave', 'info']
      return types.indexOf(this.type) === -1
        ? 'info'
        : this.type
    },
    mainStyle () {
      return {
        textAlign: this.realAlign
      }
    },
    containerStyle () {
      const directions = {
        'top': 'column',
        'bottom': 'column-reverse',
        'left': 'row',
        'right': 'row-reverse'
      }
      return {
        flexDirection: directions[this.direction]
      }
    },
    activeLineStyle () {
      const types = Colors.types
      const colors = Colors.colors
      let index = types.indexOf(this.theme)
      return {
        width: this.width * (this.value / this.total) + 'px',
        backgroundColor: colors[index]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dc-proportion {
  display: inline-block;
  vertical-align: middle;
  &__container {
    @include setFlex(column, flex-start);
  }
  &__text {
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: $TEXT-SECONDARY;
    text-align: left !important;
    user-select: none;
    margin: 0 8px;
  }
  &__process {
    position: relative;
    & > div {
      height: 8px;
      background-color: $BG;
      border: none;
      border-radius: 4px;
      box-shadow: none;
    }
    &--active {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
