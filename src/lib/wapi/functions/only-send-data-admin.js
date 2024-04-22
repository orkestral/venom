export async function onlySendDataAdmin(chat, type) {
  if (!chat.includes('@g.us')) {
    return WAPI.scope(chat, true, 404, 'The number is not a group')
  }

  if (typeof type !== 'boolean') {
    return WAPI.scope(chat, true, 404, 'the type must be boolean')
  }

  if (chat && chat.status != 404 && chat.id) {
    const chat = await WAPI.sendExist(chat)
    try {
      await Store.onlySendAdmin.sendSetGroupProperty(chat.id, `restrict`, type)
      return WAPI.scope(chat, false, 200, 'successfully changed')
    } catch {
      console.log('ddd')
    }
  } else {
    if (!chat.erro) {
      chat.erro = true
    }
    return chat
  }
}
