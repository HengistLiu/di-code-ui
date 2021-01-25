export { default as Avatar } from './components/Avatar'
export { default as Button } from './components/Button'
export { default as Panel } from './components/Panel'
export { default as PanelTitle } from './components/PanelTitle'
export { default as Carousel } from './components/Carousel'
export { default as CarouselItem } from './components/CarouselItem'
export { default as Input } from './components/Input'
export { default as InquireBox } from './components/InquireBox'
export { default as Level } from './components/Level'
export { default as Magnifier } from './components/Magnifier'
export { default as MessageBox } from './components/MessageBox'
export { default as MultipleUpload } from './components/MultipleUpload'
export { default as Notice } from './components/Notice'
export { default as Partition } from './components/Partition'
export { default as Proportion } from './components/Proportion'
export { default as RightMenu } from './components/RightMenu'
export { default as Select } from './components/Select'
export { default as Switch } from './components/Switch'
export { default as SplitLine } from './components/SplitLine'
export { default as Tab } from './components/Tab'
export { default as Table } from './components/Table'
export { default as TableColumn } from './components/TableColumn'
export { default as TableDrawer } from './components/TableDrawer'
export { default as TableTr } from './components/TableTr'
export { default as Title } from './components/Title'
export { default as Tree } from './components/Tree'
export { default as Upload } from './components/Upload'

export { default as Dialog } from './plugins/Dialog'
export { default as Message } from './plugins/Message'
export { default as RightMenus } from './plugins/RightMenus'

const components = []
const directives = []
const plugins = []

const requireComponent = require.context('./components', true, /\.vue$/)
const directivesPlugins = require.context('./directives', true, /\.js$/)
const requirePlugins = require.context('./plugins', true, /\.js$/)
/**
 * 将文件夹内所有vue组件一次挂载，工程化操作
 */
requireComponent.keys().forEach(fileName => {
  // requireComponent(fileName) 返回一个Module
  components.push(requireComponent(fileName).default)
})

/**
 * 将文件夹内所有vue自定义指令一次挂载，工程化操作
 */
directivesPlugins.keys().forEach(fileName => {
  directives.push(directivesPlugins(fileName).default)
})

/**
 * 将文件夹内所有vue插件一次挂载，工程化操作
 */
requirePlugins.keys().forEach(fileName => {
  plugins.push(requirePlugins(fileName).default)
})
/**
 * 绑定组件
 * @param Vue
 */
function bindComponents (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

/**
 * 添加组件
 * @param Vue
 */
function addPlugins (Vue) {
  plugins.forEach(plugin => {
    Vue.use(plugin)
  })
}

function addDirectives (Vue) {
  directives.forEach(directive => {
    Vue.use(directive)
  })
}
/**
 * 为了使用 Vue.use() 使用插件
 * https://cn.vuejs.org/v2/api/#Vue-use
 * @param Vue
 */
function install (Vue) {
  bindComponents(Vue)
  addDirectives(Vue)
  addPlugins(Vue)
}

export default { install }
