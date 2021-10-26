/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  performance: {
    hints: false,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/, // regex which check for files ending with `.ts` extension
        use: 'ts-loader',
        exclude: '/node_modules/', // as a regex
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
  ],
};
