export function addonChatState() {
  window.WAPI.onChatState = function (callback) {
    window.WAPI.waitForStore(['Chat'], () => {
      Store.Chat.on('change:presence.chatstate.type', (e) => {
        const event = e._events.all[0].context;
        const obj = {
          id: event.id,
          isGroup: event.isGroup,
          isUser: event.isUser,
          type: e.type
        };
        callback(obj);
      });
    });
    return true;
  };
}
