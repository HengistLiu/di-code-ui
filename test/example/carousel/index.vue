<template>
  <div class="main">
    <dc-carousel arrow dots trigger="hover">
      <dc-carousel-item v-for="(item) in list" :key="item.value">
        <img src="http://www.gpnuacm.com/static/ojoj/image/carousel2.jpg">
      </dc-carousel-item>
    </dc-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowList: false,
      list: [
        { label: '一', value: 1 },
        { label: '二', value: 2 },
        { label: '三', value: 3 },
        { label: '四', value: 4 }
      ],
      timer: null
    }
  },
  methods: {
    addItem () {
      this.timer = setTimeout(() => {
        if (this.list.length === 6) {
          clearTimeout(this.timer)
          this.timer = null
          return
        }
        this.list.push({
          label: 'add' + new Date(),
          value: this.list.length + 1
        })
        this.addItem()
      }, 16)
    }
  },
  created () {
    this.addItem()
  }
}
</script>

<style lang="scss" scoped>
  .main {
    margin: 0 auto;
    // padding: 50px 40px;
  }
</style>
