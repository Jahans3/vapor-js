const path = require('path')
const webpack = require('webpack')

module.exports = ({
  name,
  path: filePath = 'src/packages/',
  out: outPath = 'lib/',
  ...options
}) => ({
  entry: `./${filePath}${name}/index.js`,
  output: {
    path: path.join(__dirname, `../${outPath}`),
    filename: `${name}.js`
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(true)
    })
  ],
  ...options
})
