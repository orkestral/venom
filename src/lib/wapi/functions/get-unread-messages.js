export async function getUnreadMessages(undread = true) {
  const arr = []
  let chats

  if (undread) {
    chats = await Store.Chat.filter((e) => e.unreadCount > 0)
  } else {
    chats = await Store.Chat.filter((e) => e.unreadCount <= 0)
  }

  for (const chat of chats) {
    const t = chat.msgs._models.slice(-chat.unreadCount)
    for (const messageObj of t) {
      const message = await WAPI.processMessageObj(messageObj, true, true)
      if (message) {
        arr.push(message)
      }
    }
  }

  return arr
}
