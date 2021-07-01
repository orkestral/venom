export async function sendLocation(
  chatId,
  latitude,
  longitude,
  location = null
) {
  const chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    const newMsgId = await window.WAPI.getNewMessageId(chatId);
    const inChat = await WAPI.getchatId(chatId).catch(() => {});
    const fromwWid = await window.Store.Conn.wid;

    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }

    const message = {
      ack: 0,
      id: newMsgId,
      local: !0,
      self: 'in',
      t: parseInt(new Date().getTime() / 1000),
      to: chatId,
      from: fromwWid,
      isNewMsg: !0,
      type: 'location',
      lat: latitude,
      lng: longitude,
      loc: location,
    };

    const result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, message)))[1] || '';

    let m = {
        latitude: latitude,
        longitude: longitude,
        title: location,
        type: 'location',
      },
      obj;
    if (result == 'success' || result == 'OK') {
      obj = WAPI.scope(newMsgId, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      obj = WAPI.scope(newMsgId, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
