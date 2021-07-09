export async function markUnseenMessage(id) {
  const chat = await WAPI.sendExist(id);
  if (!chat.erro) {
    await Store.ReadSeen.markUnread(chat, true)
      .then(() => {
        return WAPI.scope(undefined, false, 'OK', null);
      })
      .catch(() => {
        return WAPI.scope(undefined, true, 'Error', null);
      });
    return true;
  } else {
    return false;
  }
}
