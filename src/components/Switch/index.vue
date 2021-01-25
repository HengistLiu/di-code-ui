<template>
  <div class="switch"
       :style="containerStyle">
    <ul class="switch__list"
        :style="listStyle"
        @click.stop="clickContainerHandler">
      <li v-for="(step, index) in steps"
          :key="step.value"
          :style="Object.assign({
            maxWidth: index === 0 ? height + 'px' : 'unset'
          }, itemStyle)"
          :class="{
            'switch__item': true,
            'switch__item--active': index < curStep,
            'switch__item--focus': index === curStep,
            'switch__item--disabled': step.disabled
          }">
        <div class="switch__item__point"
             :style="pointStyle"
             @click.stop="dot || !circle ? changeValue(step) : clickContainerHandler()">
          <div class="switch__item__label">
            <slot :name="step.label" v-if="$slots[step.label]"></slot>
            <span v-else>
              <i v-if="step.icon" :class="step.icon"></i>
              {{step.label}}
            </span>
          </div>
        </div>
      </li>
      <div class="switch__solid"
          :style="solidStyle">
        <slot name="stepText"/>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dc-switch',
  props: {
    value: {},
    options: {
      type: Array,
      default: () => []
    },
    dot: Boolean,
    part: Boolean,
    square: Boolean,
    radius: {},
    circle: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 80
    },
    height: {
      type: Number,
      default: 30
    },
    interval: {
      type: Number,
      default: 500
    },
    bgStyle: {
      type: Object,
      default: () => ({})
    },
    lineStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    steps () {
      return this.options.map(i => {
        return typeof i === 'object' ? i : { value: i }
      })
    },
    curStep () {
      return this.steps.findIndex(i => i.value === this.value)
    },
    realRadius () {
      return this.radius != null ? this.radius : `${this.height / 2}px`
    },
    containerStyle () {
      return {
        width: this.width <= -1
          ? 'auto'
          : this.width + 'px'
      }
    },
    listStyle () {
      return Object.assign({
        borderRadius: `${this.realRadius} ${this.realRadius}`,
        cursor: this.circle ? 'pointer' : 'default'
      }, this.bgStyle)
    },
    itemStyle () {
      return {
        height: `${this.height}px`
      }
    },
    pointStyle () {
      return {
        width: `${this.height}px`,
        height: `${this.height}px`,
        borderRadius: this.radius ? this.radius : '50%',
        backgroundColor: this.dot ? 'rgba(0, 0, 0, .05)' : 'transparent'
      }
    },
    solidStyle () {
      const widthPrecent = this.curStep === -1 || this.steps.length === 0
        ? 0
        : this.steps.length === 1
          ? 100
          : this.curStep / (this.steps.length - 1) * 100
      const offsetX = !this.part || this.curStep === -1 || this.steps.length <= 1
        ? 0
        : this.curStep > 0
          ? this.curStep < this.steps.length - 1
            ? 0 - this.height / 2
            : 0 - this.height
          : 0
      return Object.assign({
        width: this.part ? `${this.height}px` : `${widthPrecent}%`,
        minWidth: `${this.height}px`,
        height: `${this.height}px`,
        borderRadius: `${this.realRadius} ${this.realRadius}`,
        backgroundColor: '#31ac75',
        left: this.part ? `calc(${widthPrecent}% + ${offsetX}px)` : '0',
        transition: `${this.part ? 'left' : 'width'} ${this.interval / 1000}s ease-out`
      }, this.lineStyle)
    }
  },
  methods: {
    clickContainerHandler () {
      if (!this.circle || !this.steps.length) return
      if (this.curStep === this.steps.length - 1) {
        this.changeValue(this.steps[0])
      } else {
        this.changeValue(this.steps[this.curStep + 1])
      }
    },
    changeValue (step) {
      if (this.disabled || step.disabled) return
      this.$emit('update:value', step.value)
      this.$emit('update', step.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch {
  display: inline-block;
  position: relative;
  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    background-color: $BG_LIGHT;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, .05) inset;
    @include setFlex(row, space-between);
  }
  &__item {
    position: relative;
    flex: 1 0 auto;
    &__point {
      position: absolute;
      right: 0px;
      z-index: 1;
      user-select: none;
      cursor: pointer;
    }
    &__label {
      white-space: nowrap;
      position: absolute;
      left: 50%;
      top: 100%;
      margin-top: 8px;
      font-size: 12px;
      color: $TEXT-REGULAR;
      transform: translateX(-50%);
    }
    &:first-child {
      flex: 0 0 unset;
      .switch__item__point {
        transform: translateX(0%);
      }
    }
    &:last-child {
      .switch__item__point {
        transform: translateX(0%);
      }
    }
    &--disabled {
      .switch__item__point {
        cursor: not-allowed !important;
      }
      .switch__item__label {
        color: $TEXT-PLACEHOLDER;
      }
    }
  }
  &__solid {
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, .05) inset;
    text-align: right;
  }
}
</style>
