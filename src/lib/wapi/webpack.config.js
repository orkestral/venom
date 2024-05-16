const path = require('path')

module.exports = {
  entry: './wapi.js',
  mode: 'production', // none
  // devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, '../../../dist/lib/wapi'),
    filename: 'wapi.js',
  },
}
