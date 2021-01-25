// 给组件添加保护
const forbidOpenConsole = (event) => {
  switch (event.type) {
    case 'keydown':
      if (event.keyCode === 123) event.preventDefault()
      break
    case 'contextmenu':
      event.preventDefault()
      break
    default:
      break
  }
}
export default (Vue) => {
  if (Vue.prototype.$SafeComponentCount == null) {
    Vue.prototype.$SafeComponentCount = 0
  }

  const addSafeGuard = (el, binding) => {
    const isSelf = binding.modifiers.self
    if (isSelf) {
      el.addEventListener('contextmenu', forbidOpenConsole)
    } else {
      window.addEventListener('contextmenu', forbidOpenConsole)
      window.addEventListener('keydown', forbidOpenConsole)
      Vue.prototype.$SafeComponentCount++
    }
  }

  const removeSafeGuard = (el, binding) => {
    const isSelf = binding.modifiers.self
    if (isSelf) {
      el.removeEventListener('contextmenu', forbidOpenConsole)
    } else {
      if (Vue.prototype.$SafeComponentCount === 1) {
        window.removeEventListener('keydown', forbidOpenConsole)
        window.removeEventListener('contextmenu', forbidOpenConsole)
        Vue.prototype.$SafeComponentCount--
      }
    }
  }

  Vue.directive(
    'safe',
    {
      bind: (el, binding, vnode) => {
        const value = binding.value
        if (value) addSafeGuard(el, binding)
      },
      update: (el, binding, vnode) => {
        const value = binding.value
        if (value) {
          addSafeGuard(el, binding)
        } else {
          removeSafeGuard(el, binding)
        }
      },
      unbind: (el, binding, vnode) => {
        const value = binding.value
        if (!value) removeSafeGuard(el, binding)
      }
    }
  )
}
