module.exports = {
  devServer: {
    port: 8080, // 端口
    open: true
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
  },
  lintOnSave: false,  // 取消 eslint 验证
  publicPath: './', // 修改webpack的outPath.publicPath

}
