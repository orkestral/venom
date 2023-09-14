export async function reply(chatId, content, quotedMessageId) {
  if (typeof chatId != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'enter the chatid variable as an string'
    );
  }
  if (typeof content != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'enter the content variable as an string'
    );
  }
  if (typeof quotedMessageId != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'enter the content variable as an string'
    );
  }
  const chat = await WAPI.sendExist(chatId);
  if (chat && chat.status != 404) {
    let To = chat.id;
    const m = { type: 'deleteMessages' };
    let quotedMsgOptions = {};

    let quotedMessage = await WAPI.getMessageById(quotedMessageId, null, false);
    if (quotedMessage.erro == undefined) {
      let checkID = await WAPI.checkIdMessage(
        quotedMessage.to._serialized,
        quotedMessageId
      );
      if (checkID.erro == true) {
        return checkID;
      }
    } else {
      let obj = WAPI.scope(
        To,
        true,
        404,
        `The id ${quotedMessageId} does not exist!`
      );
      Object.assign(obj, m);
      return obj;
    }

    quotedMsgOptions = quotedMessage.msgContextInfo(chat);

    let checkID = await WAPI.checkIdMessage(chatId, quotedMessageId);
    if (checkID.erro == true) {
      return checkID;
    }

    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
    let inChat = await WAPI.getchatId(chat.id).catch(() => {});
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }
    const message = {
      id: newMsgId,
      ack: 0,
      body: content,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      isNewMsg: !0,
      type: 'chat',
      ...quotedMsgOptions
    };

    const result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1];

    if (
      result === 'success' ||
      result === 'OK' ||
      result.messageSendResult === 'OK'
    ) {
      let obj = WAPI.scope(newMsgId, false, result, '');
      Object.assign(obj, m);
      return obj;
    } else {
      let obj = WAPI.scope(newMsgId, true, result, '');
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
