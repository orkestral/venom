export async function scope(id, erro, status, text = null) {
  const me = await WAPI.getHost();
  let e = {
    me: me,
    to: id,
    erro: erro,
    text: text,
    status: status
  };
  return e;
}

export async function getchatId(chatId) {
  if (chatId) {
    let to = await WAPI.getChatById(chatId);
    if (to && typeof to === 'object') {
      let objTo = to.lastReceivedKey;
      if (objTo && typeof objTo === 'object') {
        let extend = {
          formattedName: to.contact.formattedName,
          isBusiness: to.contact.isBusiness,
          isMyContact: to.contact.isMyContact,
          verifiedName: to.contact.verifiedName,
          pushname: to.contact.pushname,
          isOnline: to.isOnline
        };
        Object.assign(objTo, extend);
        return objTo;
      }
    }
  }
  return undefined;
}

export function sendCheckType(chatId = undefined) {
  if (!chatId) {
    return WAPI.scope(chatId, true, 404, 'It is necessary to pass a number!');
  }
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
        !chatId.match(/^(\d+(-)+(\d)|\d+(\d))*@g.us$/g))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 00000000-000000@g.us or 00000000000000@g.us'
      );
    }
  }
}

export async function returnChat(chatId, returnChat = true, Send = true) {
  const checkType = WAPI.sendCheckType(chatId);
  if (!!checkType && checkType.status === 404) {
    return checkType;
  }

  let chat = await window.WAPI.getChat(chatId);
  if (!chat) {
    var idUser = new window.Store.UserConstructor(chatId, {
      intentionallyUsePrivateConstructor: true
    });
    chat = await Store.Chat.find(idUser);
  }

  if (chat === undefined) {
    const storeChat = await window.Store.Chat.find(chatId);
    if (storeChat) {
      chat =
        storeChat && storeChat.id && storeChat.id._serialized
          ? await window.WAPI.getChat(storeChat.id._serialized)
          : undefined;
    }
  }

  if (!chat) {
    return WAPI.scope(chatId, true, 404);
  }

  if (Send) {
    await window.Store.ReadSeen.sendSeen(chat, false);
  }

  if (returnChat) {
    return chat;
  }

  return WAPI.scope(chatId, false, 200);
}

export async function sendExist(chatId, returnChat = true, Send = true) {
  const checkType = await WAPI.sendCheckType(chatId);
  if (!!checkType && checkType.status === 404) {
    return checkType;
  }

  let ck = await window.WAPI.checkNumberStatus(chatId, false);

  if (
    (ck.status === 404 &&
      !chatId.includes('@g.us') &&
      !chatId.includes('@broadcast')) ||
    (ck &&
      ck.text &&
      typeof ck.text.includes === 'function' &&
      ck.text.includes('XmppParsingFailure'))
  ) {
    return WAPI.scope(chatId, true, ck.status, 'The number does not exist');
  }

  const chatWid = new Store.WidFactory.createWid(chatId);

  let chat =
    ck && ck.id && ck.id._serialized
      ? await window.WAPI.getChat(ck.id._serialized)
      : undefined;

  if (ck.numberExists && chat === undefined) {
    var idUser = new window.Store.UserConstructor(chatId, {
      intentionallyUsePrivateConstructor: true
    });
    chat = await Store.Chat.find(idUser);
  }

  if (!chat) {
    const storeChat = await window.Store.Chat.find(chatWid);
    if (storeChat) {
      chat =
        storeChat && storeChat.id && storeChat.id._serialized
          ? await window.WAPI.getChat(storeChat.id._serialized)
          : undefined;
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
    chat.id &&
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
    return WAPI.scope(chatId, true, 404);
  }

  if (Send) {
    await window.Store.ReadSeen.sendSeen(chat, false);
  }

  if (returnChat) {
    return chat;
  }

  return WAPI.scope(chatId, false, 200);
}
