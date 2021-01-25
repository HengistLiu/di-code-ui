<template>
  <div class="panel__content__title" :style="titleStyle">
    <div class="title__content">
      <slot/>
      <template v-if="en">
        <div class="title__en">
          <span :style="enStyle">{{en}}</span>
        </div>
      </template>
      <template v-else>
        <div class="title__underline" :style="{ textAlign: underlineAlign }">
          <span :style="lineStyle"></span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Colors from '@static/css/color.js'

export default {
  name: 'dc-panel-title',
  props: {
    en: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    align: {
      type: String,
      default: 'left'
    },
    lineAlign: {
      type: String,
      default: 'left'
    },
    lineColor: {
      type: String,
      default: Colors.warningColor
    },
    lineWidth: {
      type: String,
      default: '50px'
    }
  },
  computed: {
    theme () {
      const types = ['success', 'warning', 'danger', 'behave', 'info']
      return types.indexOf(this.type) === -1
        ? 'info'
        : this.type
    },
    underlineAlign () {
      return ['left', 'center', 'right'].includes(this.lineAlign)
        ? this.lineAlign
        : 'left'
    },
    titleStyle () {
      return {
        textAlign: this.align
      }
    },
    enStyle () {
      const types = Colors.types
      const colors = Colors.colors
      let index = types.indexOf(this.theme)
      return {
        color: colors[index]
      }
    },
    lineStyle () {
      const types = Colors.types
      const colors = Colors.colors
      const lucencyColors = Colors.lucencyColors
      let index = types.indexOf(this.theme)
      index = index === -1 ? 0 : index
      const dir = this.underlineAlign === 'left'
        ? 'Right'
        : this.underlineAlign === 'right'
          ? 'Left'
          : ''
      const otherDir = dir === 'Right' ? 'Left' : 'Right'
      return dir
        ? {
          [`border${otherDir}`]: `${this.lineWidth} solid ${colors[index]}`,
          [`border${dir}`]: `15px solid ${lucencyColors[index]}`
        }
        : {
          width: this.lineWidth,
          backgroundColor: colors[index]
        }
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel__content__title {
    position: relative;
    font-weight: 600;
    user-select: none;
    margin-bottom: 10px;
    .title {
      &__content {
        display: inline-block;
        color: $TEXT-REGULAR;
        font-size: 16px;
        line-height: 40px;
      }
      &__en {
        height: 15px;
        line-height: 15px;
        font-size: 13px;
        font-weight: 300;
      }
      &__underline {
        height: 0.3em;
        line-height: 0.3em;
        & > span {
          display: inline-block;
          height: 4px;
          border-radius: 2px;
        }
      }
    }
  }
</style>
