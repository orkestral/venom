/**
 * Start Typing
 * @param chatId
 * @param checkNumber the number when submitting!
 */
export async function startTyping(chatId, checkNumber = true) {
  const chat = checkNumber
    ? await WAPI.sendExist(chatId)
    : await WAPI.returnChat(chatId)
  if (chat && chat.status != 404 && chat.id) {
    await WAPI.presenceAvailable()
    const result = await Store.SetStatusChat.markComposing(chat)
    return WAPI.scope(undefined, false, result)
  }
  if (!chat.erro) {
    chat.erro = true
  }
  return chat
}

/**
 * Start Recording audio
 * @param chatId
 * @param checkNumber the number when submitting!
 */
export async function startRecording(chatId, checkNumber = true) {
  const chat = checkNumber
    ? await WAPI.sendExist(chatId)
    : await WAPI.returnChat(chatId)
  if (chat && chat.status != 404 && chat.id) {
    await WAPI.presenceAvailable()
    const result = await Store.SetStatusChat.markRecording(chat)
    return WAPI.scope(undefined, false, result)
  }
  if (!chat.erro) {
    chat.erro = true
  }
  return chat
}

/**
 * Stop Recording audio
 * @param chatId
 * @param checkNumber the number when submitting!
 */
export async function markPaused(chatId, checkNumber = true) {
  const chat = checkNumber
    ? await WAPI.sendExist(chatId)
    : await WAPI.returnChat(chatId)
  if (chat && chat.status != 404 && chat.id) {
    await WAPI.presenceAvailable()
    const result = await Store.SetStatusChat.markPaused(chat)
    return WAPI.scope(undefined, false, result)
  }
  if (!chat.erro) {
    chat.erro = true
  }
  return chat
}

/**
 * @param chatId
 * @param checkNumber the number when submitting!
 */
export async function clearPresence(chatId, checkNumber = true) {
  const chat = checkNumber
    ? await WAPI.sendExist(chatId)
    : await WAPI.returnChat(chatId)
  if (chat && chat.status != 404 && chat.id) {
    const result = await Store.SetStatusChat.clearPresence(chat)
    return WAPI.scope(undefined, false, result)
  }
  if (!chat.erro) {
    chat.erro = true
  }
  return chat
}

export async function presenceAvailable() {
  return await Store.SetStatusChat.sendPresenceAvailable()
}

export async function presenceUnavailable() {
  return await Store.SetStatusChat.sendPresenceUnavailable()
}
