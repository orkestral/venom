const { src, dest } = require('gulp');
const path = require('path');

function copy() {
  return src('./Counter.js').pipe(
    dest(path.resolve(__dirname, '../../../dist/lib/counter'))
  );
}

exports.default = copy;
