<template>
  <button
    :class="buttonStyle"
    @click.stop="clickHandler">
    <div v-if="icon" class="panel__button__icon">
      <i :class="icon"></i>
    </div>
    <div class="panel__button__label">
      <slot/>
    </div>
  </button>
</template>

<script>
export default {
  name: 'dc-panel-button',
  props: {
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    disabled: Boolean
  },
  computed: {
    buttonType () {
      return this.disabled
        ? 'ban'
        : ['success', 'warning', 'info', 'danger', 'behave', 'default'].indexOf(this.type) !== -1
          ? this.type
          : 'default'
    },
    buttonStyle () {
      return {
        'panel__button': true,
        [`panel__button--${this.buttonType}`]: true
      }
    }
  },
  methods: {
    clickHandler () {
      if (this.disabled) return
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel__button {
    display: inline-block;
    padding: 0 10px;
    transition: all .3s;
    margin: 0 5px;
    background-color: unset;
    border: unset;
    outline: unset;
    user-select: none;
    cursor: pointer;
    &__icon {
      text-align: center;
      i {
        line-height: 30px;
        font-size: 18px;
      }
    }
    &__label {
      text-align: center;
      line-height: 20px;
      font-size: 14px;
    }
    @each $c in $types {
      $i: index($types, $c);
      &--#{$c} {
        color: #{nth($colors, $i)};
        &:hover {
          color: #{nth($darkColors, $i)};
        }
      }
    }
    &--default {
      color: $TEXT-REGULAR;
      &:hover {
        color: $TEXT-PRIMARY;
      }
    }
    &--ban {
      color: $TEXT-PLACEHOLDER;
      cursor: not-allowed;
      &:hover {
        color: $TEXT-SECONDARY;
      }
    }
  }
</style>
