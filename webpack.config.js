module.exports = {
  mode: 'development',
  entry: {
    index: './src/kiechan.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname,
    filename: './public/js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 3003,
    disableHostCheck: true
  }
};