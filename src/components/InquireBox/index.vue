<!-- 查询类弹窗，复合组件基于弹窗组件开发 -->
<template>
  <transition name='inquireBox-fade'>
  <div class="inquireBox"
       v-if="!destroyOnClose || selfVisible"
       v-show="selfVisible"
       :style="boxContainerStyle">
    <dc-message-box
      :visible.sync="selfVisible"
      :title="title"
      :width="width"
      :hide-close="hideClose"
      :radius="radius"
      :zIndex="zIndex"
      :offsetY="offsetY"
      :offsetX="offsetX"
      :destroy-on-close="false"
      @close="closeHandler"
      @clickGreyHandler="clickGreyHandler">
      <!-- scope是基础弹窗组件给外部复合组件传的操作对象，暂时只有“关闭弹窗”一个方法 -->
      <template slot-scope="scope">
        <div class="inquireBox__content" :align="align">
          <slot :opers="{ close: closeHandler }"></slot>
        </div>
        <!-- 展示底部按钮，过滤没有标签的按钮 -->
        <div :class="{
                'inquireBox__footer': true,
                'inquireBox__footer--hideLine': hideFooterLine
             }"
             v-if="btnsConfig.length">
          <div class="inquireBox__buttons">
            <span v-for="(button, index) in btnsConfig.filter(i => i.label)"
                  :key="index"
                  @click="button.handler && button.handler(scope.opers)"
                  >{{button.label}}</span>
          </div>
        </div>
      </template>
    </dc-message-box>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'dc-inquire-box',
  props: {
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '询问框'
    },
    width: {
      type: String
    },
    align: {
      type: String,
      default: 'left'
    },
    // 按钮列表
    btnsConfig: {
      type: Array,
      default: () => []
    },
    radius: {
      type: String,
      default: '8px'
    },
    zIndex: {
      type: Number,
      default: 999999
    },
    offsetY: {
      type: String,
      default: '30vh'
    },
    offsetX: {
      type: String,
      default: 'unset'
    },
    visible: Boolean,
    hideClose: Boolean,
    hideFooterLine: Boolean
  },
  computed: {
    boxContainerStyle () {
      return {
        zIndex: this.zIndex
      }
    }
  },
  data () {
    return {
      selfVisible: false
    }
  },
  methods: {
    closeHandler () {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    clickGreyHandler (close) {
      this.$emit('clickGreyHandler', () => {
        close()
        this.$emit('update:visible', false)
      })
    }
  },
  watch: {
    visible: {
      handler: function () {
        this.selfVisible = this.visible
      },
      deep: false,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.inquireBox {
  position: relative;
  /* 渐进动画 */
  &-fade {
    @include setTransition('fade', .5s);
  }
  /* 询问框内容 */
  &__content {
    padding-bottom: 32px;
  }
  /* 询问框底部 */
  &__footer {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    border-radius: 15px 15px 8px 8px;
    &::before {
      content: '';
      display: block;
      position: absolute;
      height: 1px;
      width: calc(100% - 30px);
      left: 15px;
      top: 0;
      background-color: $BORDER-LIGHT;
    }
    &--hideLine {
      &::before {
        display: none;
      }
    }
  }
  /* 底部按钮 */
  &__buttons {
    line-height: 35px;
    font-size: 13px;
    color: #797979;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    & span {
      cursor: pointer;
      &:hover {
        color: $PRIMARY;
      }
    }
  }
}
</style>
