export async function getUnreadMessages(undread = true) {
  let arr = [];
  let chats;

  // console.log('.....................', typeof undread);

  if (undread === true) {
    chats = await Store.Chat.filter((e) => e.unreadCount > 0);
  } else {
    chats = await Store.Chat.filter((e) => e.unreadCount <= 0);
  }

  for (let i in chats) {
    let f = Number(i);
    if (!isNaN(f)) {
      let t = chats[i].msgs._models.slice(-chats[i].unreadCount);
      for (let r in t) {
        let h = Number(r);
        if (!isNaN(h)) {
          let message = await WAPI.processMessageObj(t[r], true, true);
          if (message) {
            arr.push(message);
          }
        }
      }
    }
  }

  return arr;
}
