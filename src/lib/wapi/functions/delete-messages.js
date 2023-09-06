export async function deleteMessages(chatId, messageArray) {
  if (typeof chatId != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'enter the chatid variable as an string'
    );
  }
  const chat = await WAPI.sendExist(chatId);
  if (chat && chat.status != 404) {
    if (!Array.isArray(messageArray)) {
      return WAPI.scope(
        chat,
        true,
        404,
        'enter the message identification variable as an array'
      );
    }

    for (let i in messageArray) {
      if (typeof messageArray[i] === 'string') {
        let checkID = await WAPI.checkIdMessage(chatId, messageArray[i]);
        if (checkID.erro == true) {
          return checkID;
        }
      }
    }

    let messagesToDelete = (
      await Promise.all(
        messageArray.map(
          async (msgId) => await WAPI.getMessageById(msgId, null, false)
        )
      )
    ).filter((x) => x);

    const To = chat.id;
    const m = { type: 'deleteMessages' };

    let jobs = [
      Store.sendRevokeMsgs(
        chat,
        messagesToDelete.filter((msg) => msg.id._serialized.includes("true")),
        true
      ),
      Store.sendDeleteMsgs(
        chat,
        messagesToDelete.filter((msg) => msg.id._serialized.includes("true")),
        true
      ),
    ];

    try {
      var result = (await Promise.all(jobs))[1];

      if (result >= 0) {
        let obj = WAPI.scope(To, false, result, '');
        Object.assign(obj, m);
        return obj;
      }
    } catch (e) {
      let obj = WAPI.scope(
        null,
        true,
        result,
        'The message has not been deleted'
      );
      Object.assign(obj, m);
      return obj;
    }
    let obj = WAPI.scope(To, true, result, '');
    Object.assign(obj, m);
    return obj;
  } else {
    if (!chat.erro) {
      chat.erro = true;
    }
    return chat;
  }
}

