import Vue from 'vue'
import Message from './index.vue'

const MessageConstruction = Vue.extend(Message)

let list = []

let container = null

function openMessage (data) {
  let obj = typeof (data) === 'string'
    ? {
      type: 'info',
      message: data,
      duration: 1500,
      showClose: true,
      isDangerHTML: false
    }
    : data
  const eleId = (new Date()).getTime().toString()
  // 生成信息框组件
  const messageElement = new MessageConstruction({
    data: {
      type: obj.type || 'info',
      message: obj.message,
      duration: obj.duration || 1500,
      showClose: obj.showClose,
      isDangerHTML: obj.isDangerHTML,
      key: eleId
    },
    methods: {
      remove (id) {
        removeElement(id)
      }
    }
  })
  // 挂载实例，并获取实例DOM元素
  const el = messageElement.$mount().$el
  el.id = eleId // 用于准确删除
  list.push(el)
  // 如果没有容器,则造一个容器包容组件
  if (container == null) {
    container = document.createElement('Div')
    container.setAttribute('style', `
      width: 400px;
      margin: 0 auto;
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
    `)
    container.appendChild(el)
    // 将toast实例DOM元素添加到文档中
    document.body.appendChild(container)
  } else {
    container.appendChild(el)
  }
  // 最多不能有8个，超过清除前面第一个
  if (list.length > 8) {
    const firstElement = list.shift()
    firstElement.remove()
  }
}

function removeElement (id) {
  let element = list.splice(
    list.findIndex(i => i.id === id),
    1
  )[0]
  if (element == null) return
  try {
    if (list.length === 0) {
      element.remove()
      container.remove()
      element = null
      container = null
    } else {
      element.remove()
      element = null
    }
  } catch (e) {}
}

function removeAll () {
  list = []
  if (container != null) {
    container.remove()
    container = null
  }
}

export default {
  install: () => {
    Vue.prototype.$message = openMessage
    Vue.prototype.$message.closeAll = removeAll
  }
}
