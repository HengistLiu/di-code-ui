<template>
  <div class="container">
    <dc-right-menu>
      <template  #default="{ opers }">
        <ul>
          <li v-for="item in list"
              :key="item.value">
            <!-- <div class="test" @contextmenu.stop="opers.open">
            </div> -->
            <button @click.stop="(e) => opers.open(e, item)">{{item.label}}</button>
          </li>
        </ul>
      </template>
      <template #menu="{ params }">
        <div slot="menu" class="menu" v-if="params">
          {{params.label}}
        </div>
      </template>
    </dc-right-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        { label: '测试1', value: 1 },
        { label: '测试2', value: 2 },
        { label: '测试3', value: 3 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
}
.test {
  width: 800px;
  height: 100px;
  background-color: pink;
}
.menu {
  width: 200px;
  height: 200px;
  background-color: red;
}

</style>
