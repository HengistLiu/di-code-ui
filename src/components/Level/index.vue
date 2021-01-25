<!-- 题目难度星级复用组件 -->
<template>
  <div>
    <ul :class="{
          'level': true,
          'level--edit': isEdit
        }">
      <template v-if="isEdit || value > 0">
        <li v-for="(item, index) in total"
            :key="index"
            :style="{
              cursor: isEdit ? 'pointer' : 'default'
            }"
            @click.stop="isEdit && $emit('change', index + 1)"
        >
          <span :class="{
                  'level__star': true,
                  [activedIcon]: true,
                  'level__star--default': (index + 1) > value,
                  'level__star--actived': (index + 1) <= value
                }"
                ></span>
        </li>
      </template>
      <template v-else>
        <li >{{noneTips}}</li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dc-level',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 5,
      validator (val) {
        return val >= 0
      }
    },
    value: {
      type: Number,
      default: 0,
      validator (val) {
        return val >= 0
      }
    },
    defaultIcon: {
      type: String,
      default: 'dc-iconfont dc-icon-level'
    },
    activedIcon: {
      type: String,
      default: 'dc-iconfont dc-icon-level'
    },
    noneTips: {
      type: String,
      default: '未评级'
    }
  }
}
</script>

<style lang="scss" scoped>
  .level {
    text-align: center;
    font-size: 12px;
    color: $BG;
    line-height: inherit;
    & > li {
      display: inline-block;
      padding: 0 2px;
    }
    & > .level__star {
      width: 14px;
      height: 14px;
    }
    &__star {
      transition: all .2s;
      &--default {
        color: $BG;
      }
      &--actived {
        color: $WARNING !important;
      }
    }
    &--edit {
      &:hover {
        .level {
          &__star {
            color: $WARNING-DARK;
          }
        }
      }
      li {
        .level {
          &__star {
            color: $BG;
          }
        }
        &:hover {
          & ~ li {
            .level {
              &__star {
                color: $BG;
              }
            }
          }
        }
      }
    }
  }
</style>
