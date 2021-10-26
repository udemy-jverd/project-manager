/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  performance: {
    hints: false,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'build',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/, // regex which check for files ending with `.ts` extension
        use: 'ts-loader',
        exclude: '/node_modules/', // as a regex
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './'),
    },
    compress: true,
    port: 3000,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
