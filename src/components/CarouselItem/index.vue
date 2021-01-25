<template>
  <div
    class="dc-carousel-item"
    :style="itemStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'dc-carousel-item',
  inject: ['status', 'getMovingSpeed', 'updateMovingQueue'],
  computed: {
    itemStyle () {
      return {
        left: this.movingX + '%',
        zIndex: this.sortIdx === this.curIdx ? 1 : 0
      }
    },
    sort () {
      return this.status.sort
    },
    curIdx () {
      return this.status.curIdx
    },
    baseX () {
      return this.sortIdx * 100
    }
  },
  data () {
    return {
      selfIdx: 0,
      sortIdx: 0,
      offsexX: 0,
      preSortId: 0,
      movingX: 0,
      needMoveX: 0
    }
  },
  methods: {
    moving () {
      if (this.needMoveX !== 0) {
        return
      } else {
        this.updateMovingQueue(true)
      }
      const moveStep = () => {
        let dir = this.offsexX < this.movingX ? 'left' : 'right'
        let d = this.getMovingSpeed(this.offsexX - this.movingX)
        // 约束速度
        if (dir === 'left') {
          d = d < -5
            ? -5
            : d > -1
              ? -1
              : d
        } else if (dir === 'right') {
          d = d > 5
            ? 5
            : d < 1
              ? 1
              : d
        }
        if (dir === 'left' && this.movingX + d <= this.offsexX) {
          this.movingX = this.offsexX
          this.needMoveX = 0
          this.updateMovingQueue(false)
          return
        }
        if (dir === 'right' && this.movingX + d >= this.offsexX) {
          this.movingX = this.offsexX
          this.needMoveX = 0
          this.updateMovingQueue(false)
          return
        }
        window.requestAnimationFrame(() => {
          this.movingX += d
          this.needMoveX = this.offsexX - this.movingX
          moveStep()
        })
      }
      moveStep()
    },
    getSelfIndex () {
      this.selfIdx = this.$parent.$children.findIndex(component => component === this)
      this.sortIdx = this.selfIdx
      this.offsexX = (this.sortIdx - this.curIdx) * 100
      this.movingX = this.offsexX
    },
    updateSortIdx () {
      this.preSortId = this.sortIdx
      this.sortIdx = this.status.sort.indexOf(this.selfIdx)
      this.offsexX = this.baseX - this.curIdx * 100
      if ((this.preSortId === 0 && this.sortIdx === this.sort.length - 1) ||
        (this.preSortId === this.sort.length - 1 && this.sortIdx === 0)) {
        this.movingX = this.offsexX
      } else {
        this.moving()
      }
    }
  },
  watch: {
    status: {
      handler: function (newVal, oldVal) {
        // 更新当前自身所在位置顺序
        if (oldVal == null || newVal.sort.length !== oldVal.sort.length) {
          this.getSelfIndex()
        }
      },
      deep: true,
      immediate: true
    },
    sort: {
      handler: function (newVal, oldVal) {
        if (oldVal == null) {
          return
        }
        this.updateSortIdx()
      },
      deep: true,
      immediate: false
    },
    curIdx: {
      handler: function (newVal, oldVal) {
        if (oldVal == null) {
          return
        }
        this.offsexX = this.baseX - this.curIdx * 100
        // this.movingX = this.offsexX
        this.moving()
      },
      deep: true,
      immediate: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .dc-carousel-item {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: $BG-LIGHT;
    overflow: hidden;
  }
</style>
