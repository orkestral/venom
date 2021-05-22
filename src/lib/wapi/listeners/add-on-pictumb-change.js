export function addonFilePicThumb() {
  window.WAPI.onFilePicThumb = function (callback) {
    window.WAPI.waitForStore(['ProfilePicThumb'], () => {
      Store.ProfilePicThumb.on('change:img', (e) => {
        const obj = {
          attributes: e.attributes,
          eurl: e.eurl,
          eurlStale: e.eurlStale,
          fallbackType: e.fallbackType,
          id: e.id,
          img: e.img,
          imgFull: e.imgFull,
          isState: e.isState,
          pendingPic: e.pendingPic,
          raw: e.raw,
          stale: e.stale,
          tag: e.tag,
          token: e.token,
        };
        callback(obj);
      });
    });
    return true;
  };
}
