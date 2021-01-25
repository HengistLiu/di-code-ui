<template>
  <div class="dc-button"
       :style="outStyle">
    <button :class="buttonClass"
            :style="inStyle"
            @click.stop="clickHandler"
            @mouseenter.self="isHover = true"
            @mouseleave.self="leaveButton">
      <template v-if="loading">
        <i class="dc-iconfont dc-icon-loading loading__icon--public"
          :style="iconStyle"></i>
      </template>
      <template v-else>
        <i
          v-if="icon"
          :class="{
            [icon]: true
          }"
          :style="iconStyle"></i>
      </template>
      <slot/>
    </button>
    <transition name="fade__tips">
    <div class="dc-button__tips"
         v-if="$slots['tips'] && isHover"
         :style="tipBgColor"
         @mouseenter.self="enterTips"
         @mouseleave.self="leaveTips">
      <div class="dc-button__tips__triangle"
           :style="tipBgColor"></div>
      <slot name="tips"></slot>
    </div>
    </transition>
  </div>
</template>

<script>
import Colors from '@static/css/color.js'

export default {
  name: 'dc-button',
  props: {
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    },
    radius: {
      type: Number,
      default: 4
    },
    transition: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      defaullt: 'auto'
    },
    reversed: Boolean,
    disabled: Boolean,
    hump: Boolean,
    fluid: Boolean,
    noBorder: Boolean,
    focus: Boolean,
    loading: Boolean,
    useTips: Boolean,
    tipsPanelColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    isDisabled () {
      return this.disabled || this.loading
    },
    theme () {
      const types = ['default', 'success', 'warning', 'danger', 'behave', 'info', 'ban']
      return this.isDisabled && !this.loading
        ? 'ban'
        : types.indexOf(this.realType) === -1
          ? 'default'
          : this.realType
    },
    buttonClass () {
      return {
        [`dc-button--${this.theme}${this.reversed ? '--reversed' : ''}${this.focus ? '--focus' : ''}`]: true,
        [`dc-button--noBorder`]: this.noBorder
      }
    },
    realType () {
      if (this.type == null) return 'default'
      const typeConfig = this.type.split('-')
      let initType = typeConfig[0] || 'default'
      let resultType = typeConfig[1] || 'default'
      return this.isHover && typeConfig.length > 1
        ? resultType
        : initType
    },
    tipBgColor () {
      return {
        backgroundColor: this.tipsPanelColor !== ''
          ? this.tipsPanelColor
          : Colors.darkBgColor
      }
    },
    rate () {
      const sizes = ['mini', 'small', 'middle', 'big']
      let d = sizes.indexOf(this.size) === -1
        ? 1
        : sizes.indexOf(this.size)
      return d
    },
    fontSize () {
      return this.size === 'default' ? 'inherit' : `${14 + this.rate}px`
    },
    outStyle () {
      return {
        display: this.fluid ? 'block' : 'inline-block'
      }
    },
    inStyle () {
      return {
        width: this.fluid ? '100%' : this.width,
        borderRadius: this.radius + 'px',
        fontSize: this.fontSize,
        lineHeight: this.size === 'default' ? 'inherit' : `${24 + 3 * this.rate}px`,
        padding: this.size === 'default' ? `3px 10px` : `3px ${10 + 3 * this.rate}px`,
        boxShadow: this.hump
          ? `${Colors.shadowColor} 1px 1px 5px 1px`
          : 'unset',
        transition: this.transition ? 'all .3s' : 'unset',
        cursor: this.isDisabled
          ? 'not-allowed'
          : this.isClickEvent ? 'pointer' : 'default'
      }
    },
    iconStyle () {
      return {
        fontSize: this.fontSize,
        marginRight: this.$slots['default'] ? `${2 + this.rate * 3}px` : 'unset'
      }
    }
  },
  data () {
    return {
      isHover: false,
      timer: null,
      isClickEvent: false
    }
  },
  methods: {
    enterTips () {
      clearTimeout(this.timer)
      this.timer = null
    },
    leaveTips () {
      this.isHover = false
    },
    leaveButton () {
      if (this.useTips) {
        this.timer = setTimeout(() => {
          if (this.isHover) this.isHover = false
          clearTimeout(this.timer)
        }, 2000)
      } else {
        this.isHover = false
      }
    },
    clickHandler (e) {
      if (this.isDisabled) return
      this.$emit('click', e)
    }
  },
  created () {
    // 判断父标签是否监听点击事件，是则添加点击手势
    this.isClickEvent = this.$options._parentListeners != null &&
      this.$options._parentListeners.click != null
  }
}
</script>

<style lang="scss" scoped>
  .fade__tips {
    @include setTransition('fadeWithTransform', .5s, translate(-50%, 110%));
  }
  button {
    min-width: 30px;
    background-color: transparent;
    outline: none;
    border: none;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    box-sizing: border-box;
    white-space: nowrap;
    cursor: pointer;
  }
  i {
    line-height: inherit;
    display: inline-block;
    position: relative;
  }
  .dc-button {
    display: inline-block;
    margin: 0 5px;
    position: relative;
    &__tips {
      position: absolute;
      white-space: nowrap;
      color: $TEXT-WHITE;
      font-size: 10px;
      border-radius: 3px;
      padding: 2px 5px;
      margin-bottom: -5px;
      bottom: 0px;
      transform: translate(-50%, 100%);
      left: 50%;
      z-index: 1;
      &__triangle {
        width: 10px;
        height: 10px;
        background-color: $BG_DARK;
        transform: rotateZ(45deg) translateX(-50%);
        position: absolute;
        top: 0px;
        left: 50%;
        z-index: -1;
      }
    }
    &--default,
    &--default--reversed {
      color: $TEXT-REGULAR;
      background-color: $BG-WHITE;
      border: 1px solid $BORDER;
      &:hover {
        background-color: $BG-LIGHT;
        border: 1px solid $BORDER-DARK;
      }
    }
    @each $c in $types {
      $i:index($types, $c);
      &--#{$c} {
        color: $TEXT-WHITE;
        background-color: #{nth($colors,$i)};
        border: 1px solid #{nth($darkColors,$i)};
        &:hover {
          background-color: #{nth($darkColors,$i)};
        }
      }
      &--#{$c} {
        &--reversed {
          color: $TEXT-REGULAR;
          border: 1px solid $BORDER;
          transition: color .2s;
          &:hover {
            color: #{nth($darkColors,$i)};
            background-color: #{nth($lucencyColors,$i)};
            border: 1px solid #{nth($darkColors,$i)};
          }
          &--focus {
            color: #{nth($darkColors,$i)};
            background-color: #{nth($lucencyColors,$i)};
            border: 1px solid #{nth($darkColors,$i)};
            &:hover {
              background-color: #{nth($darkLucencyColors,$i)};
            }
          }
        }
        &--focus {
          color: $TEXT-WHITE;
          background-color: #{nth($darkColors,$i)};
          border: 1px solid #{nth($darkColors,$i)};
        }
      }
    }
    &--ban {
      color: $TEXT-PLACEHOLDER;
      background-color: $BAN-LIGHT;
      border: 1px solid $BORDER-DARK;
      &:hover {
        color: $TEXT-PLACEHOLDER;
        background-color: $BAN;
      }
      &--reversed {
        background-color: $BAN-LUCENCY;
        border: 1px solid $BORDER;
        color: $TEXT-PLACEHOLDER;
        &:hover {
          border: 1px solid $BORDER-DARK;
        }
      }
    }
  }
  .dc-button--noBorder {
    border: none !important;
  }
</style>
