const path = require('path');

module.exports = {
  entry: './wapi.js',
  // mode: 'development',
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../../../dist/lib/wapi'),
    filename: 'wapi.js'
  }
};
