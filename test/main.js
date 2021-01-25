import Vue from 'vue'
import { Partition as Example } from './example'
import libraryConfig from '@/main.js'
import Images from './static/resource/index.js'
import '../static/iconfont/iconfont.css'

// 注册全局组件和全局插件
Vue.use(libraryConfig)
// 注册全局图片
Vue.use(Images)

Vue.config.productionTip = false

new Vue({
  render: h => h(Example)
}).$mount('#app')
