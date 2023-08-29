export async function sendSticker(sticker, chatId, metadata, type) {
  const chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
    const inChat = await WAPI.getchatId(chat.id).catch(() => {
      return WAPI.scope(chat.id, true, 404, 'Error to number ' + chatId);
    });
    if (inChat) {
      chat.lastReceivedKey && chat.lastReceivedKey._serialized
        ? (chat.lastReceivedKey._serialized = inChat._serialized)
        : '';
      chat.lastReceivedKey && chat.lastReceivedKey.id
        ? (chat.lastReceivedKey.id = inChat.id)
        : '';
    }
    const message = {
      id: newMsgId,
      ack: 0,
      encFilehash: sticker.uploadhash,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      isNewMsg: !0,
      type: 'sticker',
      deprecatedMms3Url: sticker.clientUrl,
      filehash: sticker.filehash,
      mediaKey: sticker.mediaKey,
      mimetype: 'image/webp',
      height: metadata && metadata.height ? metadata.height : 512,
      width: metadata && metadata.width ? metadata.width : 512
    };

    const result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1];

    const m = { type: type };
    if (
      result === 'success' || 
      result === 'OK' || 
      result.messageSendResult === "OK"
      ) {
      const obj = WAPI.scope(newMsgId, false, result, null);
      Object.assign(obj, m);
      return obj;
    }
    const obj = WAPI.scope(newMsgId, true, result, null);
    Object.assign(obj, m);
    return obj;
  } else {
    return chat;
  }
}
