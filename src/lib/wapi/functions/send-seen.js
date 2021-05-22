export async function sendSeen(id, done) {
  if (!id) return false;
  var chat = window.WAPI.getChat(id);
  if (chat !== undefined) {
    await Store.ReadSeen.sendSeen(chat, false);
    done && done(true);
    return true;
  }
  done && done(false);
  return false;
}
