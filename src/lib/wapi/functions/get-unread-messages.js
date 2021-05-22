export async function getUnreadMessages() {
  let chats = await Store.Chat.filter((e) => e.unreadCount > 0);
  let arr = [];
  for (let i in chats) {
    let t = chats[i].msgs._models.slice(-chats[i].unreadCount);
    for (let r in t) {
      let message = WAPI.processMessageObj(t[r], true, true);
      if (message) {
        arr.push(message);
      }
    }
  }
  return arr;
}
