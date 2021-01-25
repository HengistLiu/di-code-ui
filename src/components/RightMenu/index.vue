<template>
  <div class="rightMenu__container"
       @contextmenu.stop="(e) => e && e.preventDefault()">
    <div class="rightMenu__label">
      <slot :opers="{ open: beforeShowMenu, close: hide }"/>
    </div>
    <div ref="rightMenu"
         class="rightMenu"
         v-show="isShowRightMenu"
         @mouseleave="hideMenuByTime"
         @mouseenter="show">
      <slot name="menu" :opers="{ close: hide }" :params="params"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dc-right-menu',
  props: {
    duration: {
      type: Number,
      default: 200
    },
    disabled: Boolean
  },
  data () {
    return {
      isShowRightMenu: false,
      rightMenu: null,
      params: null,
      timer: null
    }
  },
  methods: {
    hide () {
      this.isShowRightMenu = false
    },
    show () {
      if (this.timer != null) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.isShowRightMenu = true
    },
    beforeShowMenu (event, params = {}) {
      event.preventDefault()
      if (this.disabled || this.rightMenu == null || event == null) return
      this.params = params
      this.showInEvent(event)
    },
    showInEvent (event) {
      const windowWidth = window.innerWidth - this.rightMenu.clientWidth
      const windowHeight = window.innerHeight - this.rightMenu.clientHeight
      // 打开自定义菜单
      this.rightMenu.style.right = 'unset'
      this.rightMenu.style.left = 'unset'
      this.rightMenu.style.top = 'unset'
      this.rightMenu.style.bottom = 'unset'
      if (windowWidth - event.x < 20) {
        this.rightMenu.style.right = (windowWidth + this.rightMenu.clientWidth - event.x + 1) + 'px'
      } else {
        this.rightMenu.style.left = (event.x - 1) + 'px'
      }
      if (windowHeight - event.y < 20) {
        this.rightMenu.style.bottom = (windowHeight + this.rightMenu.clientHeight - event.y + 1) + 'px'
      } else {
        this.rightMenu.style.top = (event.y - 1) + 'px'
      }
      this.isShowRightMenu = true
    },
    hideMenuByTime (time) {
      if (this.duration === -1) return
      if (this.timer != null) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.hide()
      }, this.duration)
    }
  },
  destroyed () {
    this.timer = null
    this.$RightMenus.remove(this)
  },
  mounted () {
    this.rightMenu = this.$refs['rightMenu']
    this.$RightMenus.init(this)
  },
  watch: {
    isShowRightMenu: {
      handler: function (val) {
        if (val) this.$RightMenus.show(this)
      },
      deep: false,
      immediate: false
    }
  }
}
</script>

<style lang="scss" scoped>
.rightMenu {
  position: fixed;
  z-index: 1;
  &__container {
    position: relative;
  }
  &__label {
    position: relative;
    z-index: 0;
  }
}
</style>
