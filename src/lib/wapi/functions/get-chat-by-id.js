export function getChatById(id) {
  try {
    if (id) {
      let found = WAPI.getChat(id);
      if (found) {
        return WAPI._serializeChatObj(found);
      }
    }
    throw false;
  } catch {
    return false;
  }
}
