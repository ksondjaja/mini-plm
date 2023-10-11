module.exports = {
  devServer: {
    proxy: 'http://localhost:3000'
  },
  transpileDependencies: [
    'quasar'
  ],
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
}

// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: [
//     'quasar'
//   ],

//   pluginOptions: {
//     quasar: {
//       importStrategy: 'kebab',
//       rtlSupport: false
//     }
//   }
// })
