<!-- 卡片组件 -->
<template>
  <div class="component__background--public panel">
    <div class="panel__header" v-if="isShowHeader">
      <!-- 标题 -->
      <div class="panel__title">
        <template v-if="$slots['title']">
          <slot name="title"></slot>
        </template>
        <template v-if="isShowTitle">
          <span>{{title}}</span>
        </template>
      </div>
      <!-- 右侧按钮 -->
      <div class="panel__operations" v-if="isShowOperations">
        <slot name="operations"></slot>
      </div>
    </div>
    <div class="panel__main">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dc-panel',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    isShowTitle () {
      return this.title !== '' || this.$slots['title'] != null
    },
    isShowOperations () {
      return this.buttonList.length > 0
    },
    isShowHeader () {
      return this.isShowTitle || this.isShowOperations
    }
  },
  data () {
    return {
      buttonList: [],
      slots: this.$slots
    }
  },
  methods: {
    filterButtons () {
      const components = this.$slots.operations
      if (components == null) {
        this.buttonList = []
        return
      }
      this.buttonList = components.filter(slot => {
        return slot.componentOptions != null && slot.componentOptions.tag === 'dc-panel-button'
      })
      this.$slots.operations = this.buttonList
    }
  },
  created () {
    this.filterButtons()
  },
  watch: {
    slots () {
      this.filterButtons()
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel {
    margin: 10px;
    &__header {
      /* background-color: pink; */
      border-bottom: 1px solid $BORDER-LIGHT;
      padding: 15px 0;
      @include setFlex(row, space-between);
    }
    &__title {
      display: inline-block;
      min-width: 80px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: $TEXT-WHITE;
      background-color: $PRIMARY;
      padding: 0 1.5em;
      border-radius: 0 25px 25px 0;
      user-select: none;
    }
    &__operations {
      margin: 0 10px;
      white-space: nowrap;
      @include setScroll('x');
    }
    &__main {
      min-height: 500px;
      padding: 15px 20px;
    }
  }
</style>
