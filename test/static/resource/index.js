// 用于存储图片资源
const images = {}
// 使用遍历文件api导入所有图片文件
const requireImages = require.context('./images', false, /.*/)

/**
 * 将文件夹内所有vue组件一次挂载，工程化操作
 */
requireImages.keys().forEach(imageName => {
  let key = imageName
    .replace(/^\.\/(.*)\..*$/, '$1') // 去除后缀和多余字符
    .match(/[^-_]+/g)
    .map(i => i.replace(i[0], i[0].toUpperCase()))
    .join('') // 转化为驼峰命名
  images[key] = require(`./images${imageName.slice(1)}`)
})

export default {
  install: (Vue) => {
    Vue.prototype.$Images = images
  }
}
