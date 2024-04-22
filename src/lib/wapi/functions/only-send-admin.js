export async function onlySendAdmin(chatId, type) {
  if (!chatId.includes('@g.us')) {
    return window.WAPI.scope(chatId, true, 404, 'The number is not a group')
  }

  if (typeof type !== 'boolean') {
    return window.WAPI.scope(chatId, true, 404, 'the type must be boolean')
  }
  const chat = await WAPI.sendExist(chatId)
  if (chat && chat.status != 404 && chat.id) {
    try {
      /* const onlyAdmin = await Store.onlySendAdmin.setGroupProperty(
        chat.id,
        `announcement`,
        type
      ) */
      return WAPI.scope(chatId, false, 200, 'successfully changed')
    } catch (e) {
      return WAPI.scope(chatId, true, 404, 'not changed')
    }
  } else {
    if (!chat.erro) {
      chat.erro = true
    }
    return chat
  }
}
