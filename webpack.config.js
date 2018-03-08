const path = require('path');

module.exports = {
  entry: './src/index.js',
  watch: true,
  devtool: 'eval-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '.')
  },
  module: {
    loaders: [
      {
        test: require.resolve('createjs-easeljs'),
        loader: 'imports-loader?this=>window!exports-loader?window.createjs'
      }
    ]
  }
};