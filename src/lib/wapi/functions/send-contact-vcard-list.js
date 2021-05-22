export async function sendContactVcardList(chatId, contacts) {
  if (typeof chatId != 'string') {
    var text =
      "incorrect parameter, insert an string. Example: '222222222222@c.us'";
    return WAPI.scope(chatId, true, null, text);
  }
  if (!Array.isArray(contacts)) {
    var text =
      "incorrect parameter, insert an array. Example: ['222222222222@c.us', '333333333333@c.us, ... ]";
    return WAPI.scope(chatId, true, null, text);
  }
  if (contacts.length === 1) {
    var text =
      "Enter more than one number to send. Example: ['222222222222@c.us', '333333333333@c.us, ... ]";
    return WAPI.scope(chatId, true, null, text);
  }
  var chat = await WAPI.sendExist(chatId);
  if (!chat.erro) {
    var tempMsg = Object.create(
        Store.Msg.models.filter(
          (msg) => msg.__x_isSentByMe && !msg.quotedMsg
        )[0]
      ),
      conta = contacts.map(async (e) => {
        return await WAPI.sendExist(e);
      });
    var ar = await Promise.all(conta);
    var cont = new Array();
    for (var key in ar) {
      cont.push(ar[key].__x_contact);
    }
    var vcard = cont.map(async (e) => {
      return await window.Store.Vcard.vcardFromContactModel(e);
    });
    const newMsgId = await window.WAPI.getNewMessageId(chatId);
    const Vcards = await Promise.all(vcard);
    let inChat = await WAPI.getchatId(chatId).catch(() => {});
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }
    var extend = {
      ack: 0,
      from: chatId,
      local: !0,
      self: 'out',
      id: newMsgId,
      t: parseInt(new Date().getTime() / 1000),
      to: chatId,
      type: 'multi_vcard',
      vcardList: Vcards,
      isNewMsg: !0,
    };
    Object.assign(tempMsg, extend);
    const result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg)))[1] || '';
    const m = { from: contacts, type: 'multi_vcard' };
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
