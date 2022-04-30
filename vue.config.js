process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_NAME = require('./package.json').name
process.env.VUE_APP_DEVELOPER = require('./package.json').developer

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // use this option for production linking
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue/demo/4.0/' : '/',
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false,
    },
  },
  devServer: {
    port: 8081,
  },
})
