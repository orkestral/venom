export function addOnNewAcks() {
  window.WAPI.onAck = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      Store.Msg.on('change:ack', (e) => {
        callback(e);
      });
    });
    return true;
  };
}
