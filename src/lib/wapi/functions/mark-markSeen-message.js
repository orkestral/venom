/**
 * Mark chat as read ✔️✔️
 * @param {*} id idchat
 * @returns bollean
 */
export async function markMarkSeenMessage(id) {
  const chat = await WAPI.sendExist(id)
  if (!chat.erro) {
    //await Store.ReadSeen.markUnread(chat);
    await Store.ReadSeen.sendSeen(chat, false)
    return WAPI.scope(undefined, false, 'OK', null)
  } else {
    return WAPI.scope(undefined, true, 'Error', null)
  }
}
