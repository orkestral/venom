export async function sendMessage2(id, message, done) {
  var chat = await WAPI.getChat(id);
  if (chat !== undefined) {
    try {
      if (done !== undefined) {
        chat.sendMessage(message).then(function () {
          done(true);
        });
      } else {
        chat.sendMessage(message);
      }
      return true;
    } catch (error) {
      if (done !== undefined) done(false);
      return false;
    }
  }
  if (done !== undefined) done(false);
  return false;
}
