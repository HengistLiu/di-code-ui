export default {
  methods: {
    $dispatch (fatherName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      // 这里是找最接近的父组件
      while (parent && (!name || name !== fatherName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit(eventName, params)
      }
    }
  }
}
