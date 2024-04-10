export function addonUnreadMessage() {
  window.WAPI.onUnreadMessage = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      window.Store.Chat.on('change:unreadCount', async (e) => {
        if (e.unreadCount > 0) {
          let arr = [];
          let t = e.msgs._models.slice(-e.unreadCount);
          for (let r in t) {
            let message = await WAPI.processMessageObj(t[r], true, true);
            if (message) {
              arr.push(message);
            }
          }
          callback(arr);
        }
      });
    });
    return true;
  };
}
