export async function sendContactVcard(chatId, contact, name) {
  if (typeof chatId != 'string' || chatId.length === 0) {
    return WAPI.scope(chatId, true, 404, 'It is necessary to pass the number!');
  }

  if (typeof contact != 'string' || contact.length === 0) {
    return WAPI.scope(
      contact,
      true,
      404,
      'It is necessary to pass the number!'
    );
  }

  const chat = await WAPI.sendExist(chatId);
  const cont = await WAPI.sendExist(contact);
  if (
    chat &&
    chat.status != 404 &&
    chat.id &&
    cont &&
    cont.status != 404 &&
    cont.id
  ) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    let inChat = await WAPI.getchatId(chat.id).catch(() => {
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

    if (!newMsgId) {
      return WAPI.scope(chatId, true, 404, 'Error to newId');
    }

    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
    const body = await window.Store.Vcard.vcardFromContactModel(
      cont.__x_contact
    );

    name = !name ? cont.__x_formattedTitle : name;

    const message = {
      id: newMsgId,
      ack: 0,
      body: body.vcard,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      isNewMsg: !0,
      type: 'vcard'
    };

    const result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1];

    var m = { from: contact, type: 'vcard' };
    if (result === 'success' || result || result.messageSendResult === 'OK') {
      var obj = WAPI.scope(newMsgId, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      var obj = WAPI.scope(newMsgId, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
