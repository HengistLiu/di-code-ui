<template>
  <div class="container">
    <div class="div1"
         :style="{
           height: `${300 + offset}px`
         }"></div>
    <dc-split-line :offset.sync="offset"
                   type="row"
                   :min="-100"
                   :max="100"
                   disabled/>
    <div class="div2"
         :style="{
           height: `${300 - offset}px`
         }"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      offset: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 300px;
  position: relative;
  @include setFlex(column, space-between);
  .div {
    &1, &2 {
      flex: 1 0 auto;
      width: 300px;
    }
  }
}
</style>
