export function addOnNewAcks() {
  window.WAPI.waitNewAcknowledgements = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      Store.Msg.on('change:ack', (e) => {
        callback(e);
      });
    });
    return true;
  };
}
