<!-- 页面复用组件 tab -->
<template>
  <div class="tab">
    <div class="tab__btns"
         :style="{
            paddingTop: btnOffsetY + 'px'
         }">
      <ul>
        <li :class="{
              'tab__item': true,
              'tab__item--actived': curFirstIndex === index
            }"
            :style="{
               marginBottom: cellSpacing + 'px'
            }"
            onselectstart="return false"
            v-for="(item, index) in btnsConfig"
            :key="index"
        >
          <!-- 是否有子选项 -->
          <template v-if="item.children">
            <ul>
              <li class="tab__item__child"
                  v-for="child in item.children"
                  :key="child.label"
              >
                <div :class="{
                       'tab__item__label': true,
                       'tab__item__label--actived': child.label === curTabLabel,
                       'tips__newMessage--public': child.latestTipsHandler
                         && child.latestTipsHandler()
                     }"
                     @click="changeActived(child.label)">
                <span>
                  <i :class="{
                       'item__label__icon': true,
                       [child.icon]: true
                     }"
                     v-if="child.icon"></i>
                  {{child.label}}
                </span>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <div :class="{
                   'tab__item__label': true,
                   'tab__item__label--actived': item.label === curTabLabel,
                   'tips__newMessage--public': item.latestTipsHandler
                     && item.latestTipsHandler()
                 }"
                 @click="changeActived(item.label)">
            <span>
              <i :class="{
                   'item__label__icon': true,
                   [item.icon]: true
                 }"
                 v-if="item.icon"></i>
              {{item.label}}
            </span>
            </div>
          </template>
        </li>
      </ul>

    </div>
    <div :class="{
            'tab__content': true,
            'component__background--public': !hiddenComponentStyle
         }">
      <transition name="tab-fade" mode="out-in">
        <slot></slot>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dc-tab',
  props: {
    curTab: {
      type: String,
      default: ''
    },
    cellSpacing: {
      type: Number,
      default: 30
    },
    btnOffsetY: {
      type: Number,
      default: 80
    },
    btnsConfig: {
      type: Array,
      default: () => []
    },
    hiddenComponentStyle: Boolean
  },
  data () {
    return {
      curFirstIndex: -1,
      curSecondIndex: -1,
      curTabLabel: ''
    }
  },
  methods: {
    // 初始化当前标签
    initCurLabel () {
      for (let i = 0; i < this.btnsConfig.length; i++) {
        let config = this.btnsConfig[i]
        // 如果为空标签同时没有孩子结点则是无用结点，返回
        if (!config.label && !config.children) continue
        // 是否有子按钮
        if (config.children) {
          for (let j = 0; j < config.children.length; j++) {
            let secondConfig = config.children[j]
            if (secondConfig.label && secondConfig.label === this.curTab) {
              this.curFirstIndex = i
              this.curSecondIndex = j
              this.curTabLabel = this.curTab
              break
            }
          }
        } else {
          // 否则判断自身
          if (config.label === this.curTab) {
            this.curFirstIndex = i
            this.curSecondIndex = -1
            this.curTabLabel = this.curTab
            break
          }
        }
      }
      // 如果实在找不到该按钮，找第一个有效按钮
      if (!this.curTabLabel) {
        for (let i = 0; i < this.btnsConfig.length; i++) {
          let config = this.btnsConfig[i]
          // 如果为空标签同时没有孩子结点则是无用结点，返回
          if (!config.label && !config.children) continue
          // 是否有子按钮
          if (config.children) {
            for (let j = 0; j < config.children.length; j++) {
              let secondConfig = config.children[j]
              if (secondConfig.label) {
                this.curFirstIndex = i
                this.curSecondIndex = j
                this.curTabLabel = secondConfig.label
                this.$emit('getInitLabel', this.curTabLabel)
                return
              }
            }
          } else {
            if (config.label) {
              this.curFirstIndex = i
              this.curSecondIndex = -1
              this.curTabLabel = config.label
              this.$emit('getInitLabel', this.curTabLabel)
              return
            }
          }
        }
      }
    },
    // 活跃Tab标签改变处理监听
    changeActived (curTabLabel) {
      this.$emit('changeHandler', curTabLabel)
    }
  },
  created () {
    this.initCurLabel()
  },
  watch: {
    curTab () {
      this.initCurLabel()
    }
  }
}
</script>

<style lang="scss" scoped>
  /* 渐进动画 */
  .tab-fade {
    @include setTransition('fade', .3s);
  }
  /* 主体样式 */
  .tab {
    @include setFlex(row, space-between);
    align-items: unset;
    /* 内容区样式 */
    &__content {
      position: relative;
      flex: 1 1 auto;
      min-height: 400px;
      transition: height .5s;
    }
    /* 左侧按钮 */
    &__btns {
      width: 48px;
      display: inline-block;
      padding-bottom: 20px;
      ul {
        position: sticky;
        top: 100px;
      }
    }
    &__item {
      border-radius: 8px 0 0 8px;
      padding: 1em;
      padding-bottom: 0;
      user-select: none;
      &--actived {
        background-color: $BG-LIGHT;
      }
      &__label {
        span {
          writing-mode: vertical-rl;
          font-size: 14px;
          letter-spacing: 0.5em;
          color: $TEXT-SECONDARY;
          cursor: pointer;
        }
        &--actived {
          span {
            color: $PRIMARY;
            font-weight: 600;
          }
        }
      }
      .item__label__icon {
        letter-spacing: 0;
        font-weight: 300;
      }
    }
  }
  .tab__item__child ~ .tab__item__child div{
    border-top: 2px solid $BORDER-LIGHT;
    padding-top: 0.8em;
  }
</style>
