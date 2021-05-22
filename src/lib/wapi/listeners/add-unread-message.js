export function addonUnreadMessage() {
  window.WAPI.onUnreadMessage = function (callback) {
    window.WAPI.waitForStore(['Chat'], () => {
      Store.Chat.on('change:unreadCount', (e) => {
        if (e.unreadCount > 0) {
          let arr = [];
          let t = e.msgs._models.slice(-e.unreadCount);
          for (let r in t) {
            let message = WAPI.processMessageObj(t[r], true, true);
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
