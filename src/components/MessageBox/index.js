import MessageBox from './index.vue'

function install (Vue) {
  Vue.component(MessageBox.name, MessageBox)
}

export default { install }
