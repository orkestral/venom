export async function deleteConversation(chatId, done) {
  let userId = new Store.UserConstructor(chatId, {
    intentionallyUsePrivateConstructor: true
  });
  let conversation = await WAPI.getChat(userId);

  if (!conversation) {
    if (done !== undefined) {
      done(false);
    }
    return false;
  }

  window.Store.sendDelete(conversation, false)
    .then(() => {
      if (done !== undefined) {
        done(true);
      }
    })
    .catch(() => {
      if (done !== undefined) {
        done(false);
      }
    });

  return true;
}
