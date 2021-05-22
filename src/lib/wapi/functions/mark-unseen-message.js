export async function markUnseenMessage(id) {
  if (!id) {
    return false;
  }
  var chat = window.WAPI.getChat(id);
  if (chat !== undefined) {
    await Store.ReadSeen.markUnread(chat, true);
    return true;
  } else {
    return false;
  }
}
