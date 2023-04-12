export function getChat(id) {
  if (!id) {
    return false;
  }
  id = typeof id == 'string' ? id : id._serialized;
  let found = Store.Chat.get(id);
  if (!found) {
    if (Store.CheckWid.validateWid(id)) {
      const ConstructChat = new window.Store.UserConstructor(id, {
        intentionallyUsePrivateConstructor: !0
      });
      found = Store.Chat.find(ConstructChat) || false;
    }
  }
  if (found) {
    found.sendMessage = found.sendMessage
      ? found.sendMessage
      : function () {
          return window.Store.sendMessage.apply(this, arguments);
        };
  }
  return found;
}
