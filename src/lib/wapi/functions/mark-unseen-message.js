/**
 * Mark unread chat
 * @param {*} id idchat
 * @returns bollean
 */
export async function markUnseenMessage(id) {
  const chat = await WAPI.sendExist(id)
  if (!chat.erro) {
    await Store.ReadSeen.markUnread(chat, true)
    return WAPI.scope(undefined, false, 'OK', null)
  } else {
    return WAPI.scope(undefined, true, 'Error', null)
  }
}
