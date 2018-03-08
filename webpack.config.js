var path = require('path')

module.exports = [
  {
    entry: {
      'index': path.join(__dirname, 'src', 'index.js')
    },
    output: {
      path: path.join(__dirname, 'public'),
      filename: '[name].js'
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js'
      }
    }
  }
]
