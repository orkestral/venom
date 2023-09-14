export async function sendContactVcardList(chatId, contacts) {
  if (typeof chatId != 'string') {
    return WAPI.scope(
      chatId,
      true,
      null,
      "incorrect parameter, insert an string. Example: '222222222222@c.us'"
    );
  }

  if (!Array.isArray(contacts)) {
    return WAPI.scope(
      chatId,
      true,
      null,
      "incorrect parameter, insert an array. Example: ['222222222222@c.us', '333333333333@c.us, ... ]"
    );
  }

  if (contacts.length === 1) {
    return WAPI.scope(
      chatId,
      true,
      null,
      "Enter more than one number to send. Example: ['222222222222@c.us', '333333333333@c.us, ... ]"
    );
  }

  const chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    var conta = contacts.map(async (e) => {
      return await WAPI.sendExist(e);
    });

    var ar = await Promise.all(conta);
    var cont = new Array();

    for (var key in ar) {
      if (typeof ar[key] === 'object') {
        cont.push(ar[key].__x_contact);
      }
    }

    var vcard = cont.map(async (e) => {
      if (typeof e === 'object') {
        return await window.Store.Vcard.vcardFromContactModel(e);
      }
    });

    var newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
    let inChat = await WAPI.getchatId(chat.id).catch(() => {});

    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }

    var Vcards = await Promise.all(vcard);

    const message = {
      id: newMsgId,
      ack: 0,
      from: fromwWid,
      local: !0,
      self: 'in',
      t: parseInt(new Date().getTime() / 1000),
      to: chat.id,
      type: 'multi_vcard',
      vcardList: Vcards,
      isNewMsg: !0
    };

    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, message)))[1] || '';

    var m = { from: contacts, type: 'multi_vcard' };

    if (
      result === 'success' ||
      result === 'OK' ||
      result.messageSendResult === 'OK'
    ) {
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
