export function getChatById(id, done) {
  let found = WAPI.getChat(id);
  if (found) {
    found = WAPI._serializeChatObj(found);
  } else {
    found = false;
  }

  if (done !== undefined) done(found);
  return found;
}
