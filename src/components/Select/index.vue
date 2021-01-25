<!-- 选择下拉框组件 -->
<template>
  <div :class="{
         'select': true,
         'select--valid': isValid
       }"
       :style="mainStyle"
       v-if="dataList.length"
       @mouseenter="isShowSelectMenu = true"
       @mouseleave="isShowSelectMenu = false">
    <span class="select__label" :style="labelStyle">
      {{curLabel}}
    </span>
    <span class="select__label__icon">
      <i class="dc-iconfont dc-icon-arrow-right"></i>
    </span>
    <transition name='select-fade'>
      <div v-if="isValid && isShowSelectMenu"
           class="select__menu"
      >
        <div class="component__background--public">
          <ul>
            <li onselectstart="return false"
                v-for="item in dataList"
                :key="item.value"
                :class="{
                  'text--overflow': true,
                  'select__menuItem': true,
                  'select__menuItem--active': item.value === curVal
                }"
                @click="changeItem(item)"
            >
              {{item.label}}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'dc-select',
  props: {
    dataList: {
      type: Array,
      required: true
    },
    isValid: {
      type: Boolean,
      default: true
    },
    curVal: {
      required: true
    },
    activeStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    curLabel () {
      const result = this.dataList.filter(i => i.value === this.curVal)[0]
      return result ? result.label : ''
    },
    maxWordAccount () {
      // 根据选项的列表最多字的项目作为参考, 英文数字符号为1，中文为2
      let maxWordAccount = 0
      let tempWordAccount = 0
      this.dataList.forEach(item => {
        let arr = item['label'].split(/[\u4e00-\u9fa5]/)
        tempWordAccount = arr.reduce((sum, words) => {
          return sum + words.length
        }, (arr.length - 1) * 2)
        if (maxWordAccount < tempWordAccount) {
          maxWordAccount = tempWordAccount
        }
      })
      return Math.ceil((maxWordAccount * 0.5))
    },
    mainStyle () {
      return {
        minWidth: this.maxWordAccount > 4
          ? this.maxWordAccount > 10
            ? '10em'
            : this.maxWordAccount + 'em'
          : '100px'
      }
    },
    labelStyle () {
      return Object.assign({
      }, this.activeStyle)
    }
  },
  data () {
    return {
      isShowSelectMenu: false
    }
  },
  methods: {
    changeItem (item) {
      if (item.value !== this.curVal) this.$emit('changeHandler', item.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  /* 渐进动画 */
  .select-fade {
    @include setTransition('fadeWithTransform', .3s, translateY(20%));
  }
  /* 主体样式设置 */
  .select {
    position: relative;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    padding: 0 25px 0 5px;
    max-width: 150px;
    &__label {
      cursor: default;
      display: block;
      text-align: center;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      &__icon {
        width: 20px;
        position: absolute;
        right: 3px;
        top: 50%;
        transform: translateY(-50%);
        i {
          display: inline-block;
          transition: all .3s;
        }
      }
    }
    &--valid {
      &:hover {
        .select__label__icon {
          i {
            transform: rotate(90deg);
          }
        }
      }
    }
    &__menu {
      position: absolute;
      width: 100%;
      z-index: 3;
      padding-top: 1em;
      ul {
        .select__menuItem {
          cursor: pointer;
          white-space: nowrap;
          color: #666666;
          font-size: 12px !important;
          line-height: 2.8;
          padding: 0 5px;
          & ~ li {
            border-top: 1px solid $BORDER-LIGHT;
          }
          &:first-child {
            border-radius: 8px 8px 0 0;
          }
          &:last-child {
            border-radius: 0 0 8px 8px;
          }
          &:hover,
          &--active {
            color: $TEXT-WHITE;
            background-color: $PRIMARY;
          }
        }
      }
      /* 选择框顶部三角 */
      & > div {
        border-top: 2px solid $PRIMARY;
        border-radius: 10px;
        &::before{
          content: '';
          display: inline-block;
          position: absolute;
          border: 10px solid transparent;
          border-bottom: 8px solid $PRIMARY;
          top: -19px;
          left: 50%;
          margin-left: -10px;
        }
      }
    }
    /* 焦点时展示下拉窗 */
    &:hover {
      .select__menu {
        display: block;
      }
    }
  }
</style>
