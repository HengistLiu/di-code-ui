import Vue from 'vue'
import InquireDialog from './index.vue'

const InquireBoxConstruction = Vue.extend(InquireDialog) // 创建Vue子类

// 记录当前组件
let el = null

function openDialog ({ content, handlers }) {
  if (el != null) return
  // 生成信息框组件
  const inquireDialog = new InquireBoxConstruction({
    data: {
      content: content,
      inquireBoxBtnList: handlers
    },
    methods: {
      remove () {
        removeElement()
      }
    }
  })
  // 挂载实例，并获取实例DOM元素
  el = inquireDialog.$mount().$el
  // 将toast实例DOM元素添加到文档中
  document.body.appendChild(el)
}

function removeElement () {
  // 移除挂载组件
  try {
    if (el != null) {
      el.remove()
      el = null
    }
  } catch (e) {
  }
}

function configMethod () {
  // 添加实例方法
  Vue.prototype.$dialog = openDialog
}

export default configMethod
