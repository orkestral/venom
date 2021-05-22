export function scope(id, erro, status, text = null) {
  let e = {
    me: Store.Me.attributes,
    to: id,
    erro: erro,
    text: text,
    status: status,
  };
  return e;
}
export async function getchatId(chatId) {
  var to = await WAPI.getChatById(chatId);
  if (to) {
    var objTo = to.lastReceivedKey,
      extend = {
        formattedName: to.contact.formattedName,
        isBusiness: to.contact.isBusiness,
        isMyContact: to.contact.isMyContact,
        verifiedName: to.contact.verifiedName,
        pushname: to.contact.pushname,
        isOnline: to.isOnline,
      };
    Object.assign(objTo, extend);
    return objTo;
  } else {
    return undefined;
  }
}

export async function sendExist(chatId, returnChat = true, Send = true) {
  if (typeof chatId === 'string') {
    const contact = '@c.us';
    const broadcast = '@broadcast';
    const grup = '@g.us';
    if (
      contact !== chatId.substr(-contact.length, contact.length) &&
      broadcast !== chatId.substr(-broadcast.length, broadcast.length) &&
      grup !== chatId.substr(-grup.length, grup.length)
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'The chat number must contain the parameters @c.us, @broadcast or @g.us. At the end of the number!'
      );
    }
    if (
      contact === chatId.substr(-contact.length, contact.length) &&
      ((chatId.match(/(@c.us)/g) && chatId.match(/(@c.us)/g).length > 1) ||
        !chatId.match(/^(\d+(\d)*@c.us)$/g))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 000000000000@c.us'
      );
    }

    if (
      broadcast === chatId.substr(-broadcast.length, broadcast.length) &&
      (chatId.match(/(@broadcast)/g).length > 1 ||
        (!chatId.match(/^(\d+(\d)*@broadcast)$/g) &&
          !chatId.match(/^(status@broadcast)$/g)))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 0000000000@broadcast'
      );
    }

    if (
      grup === chatId.substr(-grup.length, grup.length) &&
      ((chatId.match(/(@g.us)/g) && chatId.match(/(@g.us)/g).length > 1) ||
        !chatId.match(/^\d+(-)+(\d)*@g.us$/g))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 00000000-000000@g.us'
      );
    }
  }

  let ck = await window.WAPI.checkNumberStatus(chatId),
    chat = await window.WAPI.getChat(ck.id._serialized);

  if (!chat) {
    const storeChat = await window.Store.Chat.find(chatId);
    if (storeChat) {
      chat = await window.WAPI.getChat(storeChat.id._serialized);
    }
  }

  if (!ck.numberExists && !chat.t && chat.isUser) {
    return WAPI.scope(chatId, true, ck.status, 'The number does not exist');
  }

  if (!ck.numberExists && !chat.t && chat.isGroup) {
    return WAPI.scope(
      chatId,
      true,
      ck.status,
      'The group number does not exist on your chat list, or it does not exist at all!'
    );
  }

  if (
    !ck.numberExists &&
    !chat.t &&
    chat.id.user != 'status' &&
    chat.isBroadcast
  ) {
    return WAPI.scope(
      chatId,
      true,
      ck.status,
      'The transmission list number does not exist on your chat list, or it does not exist at all!'
    );
  }

  if (!chat) {
    return WAPI.scope(ck.id._serialized, true, 404);
  }

  if (Send) {
    await window.Store.SendSeen(chat, false);
  }

  if (returnChat) {
    return chat;
  }

  return WAPI.scope(ck.id._serialized, false, 200);
}
