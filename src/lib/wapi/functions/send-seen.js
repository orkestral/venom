export async function sendSeen(id) {
  const chat = await WAPI.sendExist(id)
  if (!chat.erro) {
    await Store.ReadSeen.markUnread(chat, false)
      .then(() => {
        return WAPI.scope(undefined, false, 'OK', null)
      })
      .catch(() => {
        return WAPI.scope(undefined, true, 'Error', null)
      })
    return true
  } else {
    return false
  }
}
