export async function sendLocation(
  chatId,
  latitude,
  longitude,
  location = null
) {
  var chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    var tempMsg = await Object.create(
      Store.Msg.models.filter((msg) => msg.__x_isSentByMe && !msg.quotedMsg)[0]
    );

    const newMsgId = await window.WAPI.getNewMessageId(chatId);
    let inChat = await WAPI.getchatId(chatId).catch(() => {});
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }

    tempMsg.description = undefined;
    tempMsg.title = undefined;
    tempMsg.thumbnail = undefined;
    tempMsg.matchedText = undefined;

    var extend = {
      ack: 0,
      id: newMsgId,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      to: chatId,
      isNewMsg: !0,
      type: 'location',
      lat: latitude,
      lng: longitude,
      loc: location,
      clientUrl: undefined,
      directPath: undefined,
      filehash: undefined,
      uploadhash: undefined,
      mediaKey: undefined,
      isQuotedMsgAvailable: false,
      invis: false,
      mediaKeyTimestamp: undefined,
      mimetype: undefined,
      height: undefined,
      width: undefined,
      ephemeralStartTimestamp: undefined,
      body: undefined,
      mediaData: undefined,
    };

    Object.assign(tempMsg, extend);

    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg)))[1] || '';
    var m = {
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
