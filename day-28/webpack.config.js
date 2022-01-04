const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    'minecraft': './src/minecraft.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(glsl|obj)$/,
        use: 'raw-loader',
      },
      {
        test: /\.(jpg|png)$/,
        use: 'url-loader',
      },
    ],
  },
  resolve: {
    fallback: {
      'stream': require.resolve('stream-browserify'),
      'buffer': require.resolve('buffer/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  mode: 'development',
};
