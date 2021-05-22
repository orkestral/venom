const { src, dest } = require('gulp');
const path = require('path');

function copy() {
  return src('./jsQR.js').pipe(
    dest(path.resolve(__dirname, '../../../dist/lib/jsQR'))
  );
}

exports.default = copy;
