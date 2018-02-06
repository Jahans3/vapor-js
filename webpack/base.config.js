const path = require('path')

module.exports = ({ name, path: filePath = 'src/', out: outPath = 'lib/' }) => ({
  entry: `./${filePath}${name}/index.js`,
  output: {
    path: path.join(__dirname, `../${outPath}`),
    filename: `${name}.js`
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
})
