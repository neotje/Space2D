const path = require('path');
module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: 'localhost'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};