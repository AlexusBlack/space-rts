const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  watch: true,
  devtool: 'eval-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/images'
            }
          }
        ]
      },
      {
        test: /\.(glb)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/models'
            }
          }
        ]
      },
      {
        test: require.resolve('createjs-easeljs'),
        loader: 'imports-loader?this=>window!exports-loader?window.createjs'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Space RTS',
      template: 'index.html'
    })
  ]
};