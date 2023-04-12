export function addOnStream() {
  let initialized = false;
  const getData = () => {
    return {
      displayInfo: window.Store.Stream.displayInfo,
      mode: window.Store.Stream.mode,
      info: window.Store.Stream.info
    };
  };

  window.WAPI.onInterfaceChange = (callback) => {
    window.WAPI.waitForStore('Stream', () => {
      window.Store.Stream.on('change:info change:displayInfo change:mode', () =>
        callback(getData())
      );
      if (initialized === false) {
        initialized = true;
        callback(getData());
      }
    });
    return true;
  };
}
