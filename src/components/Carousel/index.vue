<template>
  <div class="dc-carousel">
    <div
      v-if="arrow && list.length > 1"
      class="dc-carousel__arrow dc-carousel__arrow--left"
      @click.stop="() => pre()"
      @mouseenter="stopPlay"
      @mouseout="startPlay">
      <i class="dc-iconfont dc-icon-arrow-left"></i>
    </div>
    <div
      class="dc-carousel__container"
      :style="{
        borderRadius: round + 'px'
      }"
      @mouseover="stopPlay"
      @mouseout="startPlay">
      <div class="dc-carousel__main" :style="mainStyle">
        <slot></slot>
      </div>
    </div>
    <div
      v-if="arrow && list.length > 1"
      class="dc-carousel__arrow dc-carousel__arrow--right"
      @click.stop="() => next()"
      @mouseenter="stopPlay"
      @mouseout="startPlay">
      <i class="dc-iconfont dc-icon-arrow-right"></i>
    </div>
    <!-- 列表点 -->
    <div
      v-if="list.length > 1 && dots"
      class="dc-carousel__dots"
      :style="{
        textAlign: ['left', 'center', 'right'].includes(dots) ? dots : 'center'
      }">
      <ul>
        <li
          v-for="(item, idx) in list"
          :key="idx">
          <span
            :class="{
              ['dc-carousel__dot']: true,
              ['dc-carousel__dot--active']: item === list[status.sort[status.curIdx]]
            }"
            :style="{
              transition: `all ${realSpeed / 2}ms`
            }"
            @click.stop="trigger === 'click' && moveTo(idx)"
            @mouseenter.stop="trigger === 'hover' && moveTo(idx)"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'dc-carousel',
  provide () {
    return {
      status: this.status,
      getMovingSpeed: this.getMovingSpeed,
      updateMovingQueue: this.updateMovingQueue
    }
  },
  props: {
    height: {
      type: String,
      default: '200px'
    },
    trigger: {
      type: String,
      default: 'click'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    speed: {
      type: Number,
      default: 1000
    },
    arrow: Boolean,
    dots: [Boolean, String],
    round: {
      type: Number,
      default: 0
    }
  },
  computed: {
    realSpeed () {
      return this.speed > this.interval
        ? this.interval / 2
        : this.speed > 3000
          ? 3000
          : this.speed
    },
    mainStyle () {
      return {
        height: this.height
      }
    }
  },
  data () {
    return {
      slots: this.$children,
      list: [],
      status: {
        sort: [],
        curIdx: 1
      },
      timer: null,
      movingQueues: 0,
      waitQueues: []
    }
  },
  methods: {
    getMovingSpeed (total) {
      const base = this.speed / 16.67
      return this.waitQueues.length
        ? total < 0
          ? -(base / this.waitQueues.length)
          : base / this.waitQueues.length
        : total / base
    },
    updateMovingQueue (isMoving) {
      this.movingQueues = isMoving
        ? this.movingQueues + 1
        : this.movingQueues - 1
    },
    moveTo (idx) {
      // 当前显示亮着的小点序号
      const lightIdx = this.status.sort[this.status.curIdx]
      if (idx === lightIdx) return
      if (idx > lightIdx) {
        this.next(idx - lightIdx)
      } else {
        this.pre(lightIdx - idx)
      }
    },
    pre (unit = 1) {
      this.stopPlay()
      this.$nextTick(() => {
        // 如果正在滑动中，将其放置运动队列等待运行
        if (this.movingQueues !== 0) {
          this.waitQueues.push({
            dir: 'left',
            unit: unit
          })
          return
        }
        // 实际移动操作
        if (this.list.length === 2) {
          if (this.status.curIdx === 0) {
            this.status.sort.reverse()
            this.status.curIdx = 1
            this.$nextTick(() => {
              this.status.curIdx = 0
            })
          } else {
            this.status.curIdx = 0
          }
        } else {
          if (this.status.curIdx === 1) {
            const last = this.status.sort.pop()
            this.status.sort.unshift(last)
          } else {
            this.status.curIdx--
          }
          if (unit > 1) this.pre(unit - 1)
        }
        this.startPlay()
      })
    },
    next (unit = 1) {
      this.stopPlay()
      this.$nextTick(() => {
        // 如果正在滑动中，将其放置运动队列等待运行
        if (this.movingQueues !== 0) {
          this.waitQueues.push({
            dir: 'right',
            unit: unit
          })
          return
        }
        // 实际移动操作
        if (this.list.length === 2) {
          if (this.status.curIdx === 1) {
            this.status.sort.reverse()
            this.status.curIdx = 0
            this.$nextTick(() => {
              this.status.curIdx = 1
            })
          } else {
            this.status.curIdx = 1
          }
        } else {
          if (this.status.curIdx === this.list.length - 2) {
            const first = this.status.sort.shift()
            this.status.sort.push(first)
          } else {
            this.status.curIdx++
          }
          if (unit > 1) this.next(unit - 1)
        }
        this.startPlay()
      })
    },
    initStatus () {
      this.status.sort = this.list.map((i, index) => index)
      if (this.list.length > 2) {
        this.status.curIdx = 1
      } else {
        this.status.curIdx = 0
      }
    },
    getValidSlotList (slotName) {
      this.list = []
      if (!this.$slots.default) return
      this.$slots.default.forEach(item => {
        // item.componentOption.tag存有组件名称
        if (item.componentOptions &&
        item.componentOptions.tag === 'dc-carousel-item') {
          this.list.push(item)
        }
      })
      if (this.list.length === 0) return
      // 过滤掉其他无关元素后
      this.$slots.default = this.list
      // 初始状态
      this.initStatus()
    },
    move () {
      this.stopPlay()
      this.timer = setTimeout(() => {
        this.next()
        this.move()
      }, this.interval)
    },
    startPlay () {
      if (!this.autoplay || this.list.length <= 1) return
      this.move()
    },
    stopPlay () {
      if (this.timer != null) {
        clearTimeout(this.timer)
      }
    }
  },
  beforeDestroyed () {
    this.stopPlay()
  },
  watch: {
    slots: {
      handler: function () {
        this.getValidSlotList()
        this.startPlay()
      },
      deep: false,
      immediate: true
    },
    movingQueues: {
      handler: function (newVal) {
        if (newVal === 0 && this.waitQueues.length > 0) {
          const action = this.waitQueues.shift()
          if (action.dir === 'left') {
            this.pre(action.unit)
          } else {
            this.next(action.unit)
          }
        }
      },
      deep: false,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .dc-carousel {
    position: relative;
    @include setFlex(row, space-around);
    &__container {
      width: 100%;
      background-color: $BG;
      overflow: hidden;
      position: relative;
      margin: 0 -25px;
    }
    &__main {
      width: 100%;
      position: relative;
      background-color: $BG;
      z-index: 0;
    }
    &__arrow {
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: $TEXT-PLACEHOLDER;
      font-size: 18px;
      font-weight: 600;
      border-radius: 25px;
      box-shadow: $SHADOW-LIGHT;
      position: relative;
      background-color: $BG-WHITE;
      z-index: 1;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        color: $PRIMARY;
        box-shadow: $SHADOW;
      }
    }
    &__dots {
      width: 100%;
      position: absolute;
      bottom: 10px;
      z-index: 1;
      ul {
        display: inline-block;
        list-style: none;
        margin: 0 80px;
        opacity: 0.8;
        &:hvoer {
          opacity: 1;
        }
        & > li {
          display: inline-block;
          margin: 0 4px;
        }
      }
      .dc-carousel__dot {
        display: inline-block;
        width: 20px;
        height: 8px;
        border-radius: 4px;
        background-color: $BG-SHADE-DARK;
        cursor: pointer;
        &--active {
          width: 50px;
          background-color: $BG-WHITE;
        }
      }
    }
  }
</style>
