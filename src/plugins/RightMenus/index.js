import Vue from 'vue'

const list = []

export default {
  install: () => {
    Vue.prototype.$RightMenus = {
      init (el) {
        list.push(el)
      },
      show (el) {
        list.forEach(i => {
          i.hide()
        })
        el.show()
      },
      remove (el) {
        const index = list.findIndex(i => i === el)
        if (index !== -1) {
          list.splice(index, 1)
        }
      }
    }
  }
}
