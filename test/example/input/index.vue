<template>
  <div class="main">
    <dc-input v-model="x"
              type="number"
              :range="getRange(1)"
              label="X:"
              labelWidth="50px"/>
    <dc-input v-model="y"
              type="number"
              :range="getRange(2)"
              label="Y:"
              labelWidth="50px"/>
    X: {{x}}
    Y: {{y}}
    RANGE_X: {{getRange(1)}}
    RANGE_Y: {{getRange(2)}}
    <!-- <dc-input v-model="test"
              labelWidth="57px"
              :validate="validateText"
              placeholder="请输入内容"></dc-input>
    <dc-input label="考试语言"
              chooser
              :chooser-list="langSelectList"
              :value="lang"
              labelWidth="57px"
              @changeHandler="changeHandler"
    />
    <dc-input v-model="test" labelWidth="57px" textarea label="测试" :validate="validateText" placeholder="请输入内容"></dc-input> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      x: 0,
      y: 0,
      test: '',
      langSelectList: [
        { label: 'C语言', value: 0 },
        { label: 'C++', value: 1, isSingle: true },
        { label: 'JAVA', value: 3, isSingle: true },
        { label: 'Python', value: 6, isSingle: false },
        { label: 'C#', value: 9 }
      ],
      lang: 0
    }
  },
  methods: {
    getRange (val) {
      return val === 1
        ? [0, 200 - this.y]
        : [0, 200 - this.x]
    },
    validateText (val) {
      if (!val) return '不允许为空'
      return ''
    },
    changeHandler (val) {
      this.lang = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 50px;
  }
</style>
