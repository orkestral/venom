export function base64ToFile(base64, filename) {
  var arr = base64.split(',');
  var mime = arr[0].match(/(?:data:)?(.*?)(?:;base64)?$/i)[1];
  mime = mime.split(/\s+;\s+/).join('; '); // Fix spaces, like "audio/ogg; codecs=opus"

  var bstr = window.Base64 ? window.Base64.atob(arr[1]) : atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime,
  });
}
