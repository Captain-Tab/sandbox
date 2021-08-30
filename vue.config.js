const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: (config) => {
    const plugins = []
    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@$', resolve('src'))
    // 增加ts-loader对ts文件的解析
    config.module
      .rule('ts')
      .test(/\.tsx?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        transpileOnly: true,
        appendTsSuffixTo: ['\\.vue$'],
        happyPackMode: true,
      })
      .end()
  },
  devServer: {
    port: '3000',
    disableHostCheck: true,
  },
}
