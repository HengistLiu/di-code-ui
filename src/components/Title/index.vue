<!-- 页面标题组件 -->
<template>
  <transition name="fade">
  <div v-show="show"
       class="title"
       :style="{ color: color }"
  >
    <span class="title__en">{{en}}</span>
    <ul class="title__cn">
      <li v-for="word in cnWordList"
          :key="word"
      >
        {{word}}
      </li>
    </ul>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'dc-title',
  props: {
    en: {
      type: String,
      required: true
    },
    cn: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'inherit'
    }
  },
  data () {
    return {
      cnWordList: this.splitCn(),
      show: false
    }
  },
  methods: {
    splitCn () {
      if (this.cn.length < 4 || this.cn.length % 2) {
        return this.cn.split('').slice(0, 3)
      } else {
        let length = this.cn.length
        return [
          this.cn.slice(0, length / 2),
          this.cn.slice(-length / 2)
        ]
      }
    }
  },
  watch: {
    cn () {
      this.cnWordList = this.splitCn()
    }
  },
  created () {
    this.$nextTick(() => {
      this.show = true
    })
  }
}
</script>

<style lang="scss" scoped>
  .fade {
    @include setTransition('fadeWithTransform', .5s, translateY(-20px));
  }
  .title {
    text-align: center;
    user-select: none;
    &__en {
      font-weight: 600;
      font-size: 60px;
      margin-right: 10px;
    }
    &__cn {
      font-size: 18px;
      font-weight: 600;
      display: inline-block;
      li {
        list-style: none;
      }
    }
  }
</style>
