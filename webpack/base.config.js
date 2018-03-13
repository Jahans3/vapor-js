const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = ({
  name,
  path: filePath = 'src/packages/',
  out = 'lib/',
  mode = 'production',
  target = 'node',
  ...options
}) => ({
  entry: `./${filePath}${name}/index.js`,
  output: {
    path: path.join(__dirname, `../${out}`),
    filename: `${name}.${target}.js`,
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new UglifyJsPlugin(),
    new webpack.DefinePlugin({
      window: {}
    })
  ],
  target,
  mode,
  ...options
})
