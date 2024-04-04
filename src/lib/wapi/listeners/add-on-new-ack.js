export function addOnNewAcks() {
  window.WAPI.onAck = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      window.Store.Msg.on('change:ack', (e) => {
        callback(e);
      });
    });
    return true;
  };
}
