// eslint-disable-next-line no-undef
const path = require('path');

module.exports = {
  entry: './wapi.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, '../../../dist/lib/wapi'),
    filename: 'wapi.js'
  }
};
