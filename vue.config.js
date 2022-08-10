module.exports = {
  // 基本路径
  publicPath:"./",
  // 输出文件目录
  outputDir: 'web-demo',
  lintOnSave: true,
  devServer: {
    proxy:{
      "/api": {
          target: "https://api.lehuitech.com.cn/22api/wj/", //目标地址
          ws: true, 
          changeOrigin: true,
          pathRewrite: {
              "^/api": ''
          }
      },
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '默沙东-打分后台管理 '
        return args
      })
  }
}