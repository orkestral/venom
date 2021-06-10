export async function getUnreadMessages() {
  let arr = [];
  window.WAPI.waitForStore(['Chat', 'Msg'], async () => {
    let chats = await Store.Chat.filter((e) => e.unreadCount > 0);

    for (let i in chats) {
      let f = Number(i);
      if (!isNaN(f)) {
        let t = chats[i].msgs._models.slice(-chats[i].unreadCount);
        for (let r in t) {
          let h = Number(r);
          if (!isNaN(h)) {
            let message = WAPI.processMessageObj(t[r], true, true);
            if (message) {
              arr.push(message);
            }
          }
        }
      }
    }
  });
  return arr;
}
