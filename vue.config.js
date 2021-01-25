const path = require('path')// 引入path模块
function resolve (dir) {
  return path.join(__dirname, dir)// path.join(__dirname)设置绝对路径
}

module.exports = {
  // 配置全局调用scss
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '~@static/css/global.scss';
          @import '~@static/css/color.scss';
          @import '~@static/css/utils/index.scss';
          @import '~@static/css/utils/class.scss';
        `
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('@static', resolve('./static'))

    if (process.env.USR_ANALYZER) { // 分析
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
}
