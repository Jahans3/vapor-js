const path = require('path')

module.exports = ({ name, path = 'src' }) => ({
  entry: `./${path}/${name}/index.js`,
  output: {
    path: path.join(__dirname, `../lib/${name}`),
    filename: `${name}.js`
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
})
