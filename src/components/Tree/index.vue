<template>
  <transition name='treeFade'>
  <div class="tree"
       v-if="visible"
       @click="$emit('clickTreePanelBg')"
  >
    <div class="tree_container">
      <div class="tree__group"
           v-for="(tree, level) in choosedList"
           :key="tree"
      >
        <span class="tree__group__label">
          <template v-if="level < headersName.length">
            {{headersName[level]}}
          </template>
          <template v-else>
            {{dataDirt[choosedList[level-1]]}}
          </template>
        </span>
        <ul class="tree__group__list scrollStyle--public">
          <li :class="{
                'tree__group__item': true,
                'tree__group__item--active': item === curVal,
                'tree__group__item--focus': choosedList.includes(item)
              }"
              v-for="(item, index) in Object.keys(getTreeData(level))"
              :key="index"
              @click.stop="clickNodeHandler(item)"
              @mouseover="$emit('focusHandler', item)"
              @mouseleave="$emit('blurHandler', item)"
          >
            <span>{{dataDirt[item]}}</span>
            <template v-if="isTree(item)">
              <span class="dc-iconfont dc-icon-arrow-right tree__group__icon--open"></span>
            </template>
            <template v-else>
              <span :class="{
                      'tree__group__icon--sure': item !== curVal,
                      'tree__group__icon--focus': item === curVal
                    }"
                    @click.stop="$emit('sureHandler', item)">
                <i :class="item === curVal
                     ? 'dc-iconfont dc-icon-close'
                     : 'dc-iconfont dc-icon-sure'"
                ></i>
              </span>
            </template>
          </li>
        </ul>
      </div>
      <!-- 待选组 -->
      <div class="tree__group"
           v-if="Object.keys(getTreeData(choosedList.length)).length"
      >
        <span class="tree__group__label">
          {{headersName[choosedList.length]}}
        </span>
        <ul class="tree__group__list scrollStyle--public">
          <li class="tree__group__item"
              v-for="(item, index) in Object.keys(getTreeData(choosedList.length))"
              :key="index"
              @click.stop="clickNodeHandler(item)"
              @mouseover="$emit('focusHandler', item)"
              @mouseleave="$emit('blurHandler', item)"
          >
            <span>{{dataDirt[item]}}</span>
            <template v-if="isTree(item)">
              <span class="dc-iconfont dc-icon-arrow-right tree__group__icon--open"></span>
            </template>
            <template v-else>
              <span :class="{
                      'tree__group__icon--sure': item !== curVal,
                      'tree__group__icon--focus': item === curVal
                    }"
                    @click.stop="$emit('sureHandler', item)">
                <i :class="item === curVal
                     ? 'dc-iconfont dc-icon-close'
                     : 'dc-iconfont dc-icon-sure'"
                ></i>
              </span>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="tree_slot">
      <slot></slot>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'dc-tree',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    curVal: {
      default: ''
    },
    tempVal: {
      default: ''
    },
    dataDirt: {
      type: Object,
      default: () => ({})
    },
    dataTree: {
      type: Object,
      default: () => ({})
    },
    headersName: {
      type: Array,
      default: () => ['选择菜单']
    }
  },
  data () {
    return {
      choosedList: []
    }
  },
  methods: {
    clickNodeHandler (node) {
      if (!this.isTree(node)) {
        this.$emit('clickLeafHandler', node)
      }
      this.$emit('changeHandler', node)
    },
    getTreeData (level) {
      let tree = this.dataTree
      for (let i = 0; i < level; i++) {
        tree = tree[this.choosedList[i]]
      }
      return tree
    },
    // 初始化已选择列表
    initChoseList (tree) {
      for (let item in tree) {
        this.choosedList.push(item)
        const itemSonKeys = Object.keys(tree[item])
        // 直接判断是否相等，相等直接返回
        if (item.toString() === this.tempVal.toString()) {
          if (itemSonKeys.length === 0) {
            // 派发事件给父元素告诉父元素它点击了叶子节点
            // this.$emit('clickLeafHandler', this.tempVal)
          }
          return true
        } else {
          // 是否有子元素，递归进入判断
          if (itemSonKeys.length > 0) {
            if (this.initChoseList(tree[item])) {
              return true
            } else {
              this.choosedList.pop()
            }
          } else {
            this.choosedList.pop()
          }
        }
      }
    },
    isTree (nodeName) {
      const search = (tree) => {
        for (let item in tree) {
          const itemSonKeys = Object.keys(tree[item])
          // 直接判断是否相等，相等直接返回
          if (item.toString() === nodeName.toString()) {
            if (itemSonKeys.length > 0) return true
          } else {
            // 是否有子元素，递归进入判断
            if (itemSonKeys.length > 0) {
              if (search(tree[item])) {
                return true
              }
            }
          }
        }
      }
      return search(this.dataTree)
    }
  },
  created () {
    this.initChoseList(this.dataTree)
  },
  watch: {
    tempVal () {
      this.choosedList = []
      this.initChoseList(this.dataTree)
    }
  }
}
</script>

<style lang="scss" scoped>
  /* 渐进动画 */
  .treeFade {
    @include setTransition('fade', .5s);
  }
  .tree {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $BG-SHADE-DARK;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 8px;
    overflow: hidden;
    user-select: none;
    &_container {
      display: flex;
      flex-direction: row;
      height: 100%;
    }
    &__group {
      position: relative;
      background-color: $BG-WHITE;
      border-right: 1px solid $BORDER-LIGHT;
      line-height: 40px;
      &__label {
        line-height: inherit;
        font-size: inherit;
        font-weight: inherit;
        padding: 0 20px;
        font-weight: 600;
        color: $TEXT-REGULAR;
        cursor: default;
      }
      &__list {
        border-top: 2px solid $BORDER-LIGHT;
        padding-bottom: 100px;
        height: 100%;
        overflow-y: auto;
      }
      &__item {
        position: relative;
        width: 200px;
        color: $TEXT-SECONDARY;
        font-size: 14px;
        font-weight: 600;
        padding: 0 20px;
        cursor: pointer;
        overflow: hidden;
        border-bottom: 2px solid $BORDER-LIGHT;
        &--focus {
          color: $TEXT-WHITE !important;
          background-color: $SUCCESS-LIGHT;
        }
        &--active {
          color: $TEXT-WHITE !important;
          background-color: $SUCCESS-DARK;
          &:hover {
            background-color: $WARNING-LIGHT;
          }
        }
        &:hover {
          color: $TEXT-REGULAR;
          .tree__group__icon {
            &--sure,
            &--focus {
              transform: translateX(0)
            }
          }
        }
      }
      &__icon {
        &--open {
          float: right;
          font-weight: 300;
        }
        &--sure,
        &--focus{
          width: 45px;
          display: inline-block;
          background-color: $BG-LIGHTER;
          color: $TEXT-REGULAR;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          transform: translateX(100%);
          transition: all .3s;
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &--sure {
          &:hover {
            color: $SUCCESS;
          }
        }
        &--focus {
          &:hover {
            color: $WARNING;
          }
        }
      }
      &::after {
        content: '';
        display: inline-block;
        width: 50px;
        height: 4px;
        border-radius: 2px;
        background-color: $BG;
        position: absolute;
        bottom: 20px;
        left: 50%;
        margin-left: -25px;
        transition: all .3s;
      }
      &:hover {
        background-color: $BG-LIGHTER;
        &::after {
          background-color: $PRIMARY;
        }
      }
    }
  }
  /* 插槽区 */
  .tree_slot {
    position: absolute;
    bottom: 30px;
    right: 50px;
  }
</style>
