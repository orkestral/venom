export async function deleteConversation(chatId, done) {
  const userId = new Store.UserConstructor(chatId, {
    intentionallyUsePrivateConstructor: true,
  })
  const conversation = await WAPI.getChat(userId)

  if (!conversation) {
    if (done !== undefined) {
      done(false)
    }
    return false
  }

  window.Store.sendDelete(conversation, false)
    .then(() => {
      if (done !== undefined) {
        done(true)
      }
    })
    .catch(() => {
      if (done !== undefined) {
        done(false)
      }
    })

  return true
}
