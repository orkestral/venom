export async function sendContactVcard(chatId, contact, name) {
  const chat = await WAPI.sendExist(chatId);
  const cont = await WAPI.sendExist(contact);

  if (chat.id && cont.id) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id);
    const inChat = await WAPI.getchatId(chatId).catch(() => {});

    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }

    const fromwWid = await window.Store.Conn.wid;
    var body = await window.Store.Vcard.vcardFromContactModel(cont.__x_contact);
    name = !name ? cont.__x_formattedTitle : name;
    var message = {
      id: newMsgId,
      ack: 0,
      body: body.vcard,
      from: fromwWid,
      self: 'in',
      vcardFormattedName: name,
      isNewMsg: true,
      t: parseInt(new Date().getTime() / 1000),
      to: chat.id,
      type: 'vcard',
    };

    const result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1];

    var m = { from: contact, type: 'vcard' };
    if (result === 'success' || result === 'OK') {
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
