export async function sendLocation(
  chatId,
  latitude,
  longitude,
  location = null
) {
  const chat = await WAPI.sendExist(chatId)
  if (Number.isNaN(Number(latitude)) || Number.isNaN(Number(longitude))) {
    return WAPI.scope(
      chatId,
      true,
      null,
      'latitude and longitude must be numbers'
    )
  }
  if (!chat.erro) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized)
    const inChat = await WAPI.getchatId(chat.id).catch(() => {})
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()

    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized
      chat.lastReceivedKey.id = inChat.id
    }
    const newid = await window.WAPI.getNewMessageId(chat.id._serialized, chatId)
    const message = {
      type: 'location',
      ack: 0,
      from: fromwWid,
      id: newid,
      local: !0,
      isNewMsg: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      to: chat.id,
      lat: Number(latitude),
      lng: Number(longitude),
      loc: location,
    }

    const result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, message)))[1] || ''

    const m = {
      latitude: latitude,
      longitude: longitude,
      title: location,
      type: 'location',
    }
    let obj
    if (result == 'success' || result == 'OK') {
      obj = WAPI.scope(newMsgId, false, result, null)
      Object.assign(obj, m)
      return obj
    } else {
      obj = WAPI.scope(newMsgId, true, result, null)
      Object.assign(obj, m)
      return obj
    }
  } else {
    return chat
  }
}
