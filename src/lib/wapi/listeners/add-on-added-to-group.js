export function addOnAddedToGroup() {
  /**
   * Registers a callback that fires when your host phone is added to a group.
   * @param callback - function - Callback function to be called when a message acknowledgement changes. The callback returns 3 variables
   * @returns {boolean}
   */
  window.WAPI.onAddedToGroup = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      Store.Chat.on('add', (chatObject) => {
        if (chatObject && chatObject.isGroup) {
          callback(chatObject);
        }
      });
    });
    return true;
  };
}
