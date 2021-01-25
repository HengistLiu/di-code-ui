<template>
  <div class="circle__container">
    <div class="circle"
        :style="outerStyle">
      <div class="circle__part circle__part__left" :style="leftContainerStyle">
        <div class="left__main" :style="leftStyle"></div>
      </div>
      <div class="circle__part circle__part__right" :style="rightContainerStyle">
        <div class="right__main" :style="rightStyle"></div>
      </div>
      <div class="circle__text"
          :style="textStyle">
        <template v-if="$slots['text']">
          <slot name="text"></slot>
        </template>
        <template v-else>
          <span>{{parseInt(value*100/360)}}%</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dc-circle-proportion',
  computed: {
    outerStyle () {
      return {
        height: `${this.radius * 2}px`,
        width: `${this.radius * 2}px`
      }
    },
    sameContainerStyle () {
      return {
        width: `${this.radius}px`,
        backgroundColor: this.outerColor
      }
    },
    leftContainerStyle () {
      return Object.assign({
        borderRadius: `${this.radius * 2}px 0 0 ${this.radius * 2}px/${this.radius * 2}px 0 0 ${this.radius * 2}px`
      }, this.sameContainerStyle)
    },
    rightContainerStyle () {
      return Object.assign({
        borderRadius: `0 ${this.radius * 2}px ${this.radius * 2}px 0/0 ${this.radius * 2}px ${this.radius * 2}px 0`
      }, this.sameContainerStyle)
    },
    leftStyle () {
      return {
        backgroundColor: this.bgColor,
        transform: this.value > 180 ? `rotate(${this.value - 180}deg)` : 'rotate(0deg)',
        borderRadius: `${this.radius * 2}px 0 0 ${this.radius * 2}px/${this.radius * 2}px 0 0 ${this.radius * 2}px`
      }
    },
    rightStyle () {
      return {
        backgroundColor: this.bgColor,
        transform: this.value <= 180 ? `rotate(${this.value}deg)` : 'rotate(180deg)',
        borderRadius: `0 ${this.radius * 2}px ${this.radius * 2}px 0/0 ${this.radius * 2}px ${this.radius * 2}px 0`
      }
    }
  },
  props: {
    initValue: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    radius: {
      type: Number,
      default: 100
    },
    outerColor: {
      type: String,
      default: '#3bc688'
    },
    bgColor: {
      type: String,
      default: '#f2f2f2'
    },
    textStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      value: 0,
      timer: null
    }
  },
  methods: {
    goAnimation () {
      let ifEndUpdate = true
      window.requestAnimationFrame(() => {
        if (this.value < this.initValue) {
          let add = this.step > 1 ? this.step : 1
          if (this.value + add > this.initValue) add = this.initValue - this.value
          this.value += add
          ifEndUpdate = false
        }
        if (!ifEndUpdate) this.goAnimation()
      })
    }
  },
  watch: {
    initValue: {
      handler: function () {
        this.value = 0
        this.goAnimation()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.circle {
  position: relative;
  &__container {
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
  }
  &__part {
    position:absolute;
    height:100%;
    overflow: hidden;
    &__left {
      .left__main {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        transform-origin:right center;
        transform: rotate(0deg);
      }
    }
    &__right {
      right:0;
      .right__main {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        transform-origin:left center;
        transform: rotate(0deg);
      }
    }
  }
  &__text {
    position: absolute;
    display:flex;
    align-items: center;
    justify-content: center;
    height:76%;
    width:76%;
    left:12%;
    top:12%;
    border-radius:100%;
    background:$BG-DARKER;
    color: $TEXT-WHITE;
  }
}
</style>
