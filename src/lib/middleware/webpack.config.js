const path = require('path');

module.exports = {
  entry: './middleware.ts',
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
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'middleware.js',
    path: path.resolve(__dirname, '../../../dist/lib/middleware')
  }
};
