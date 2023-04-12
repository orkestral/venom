export async function sendMessage(
  to,
  content,
  status = false,
  passId,
  checkNumber = true,
  forcingReturn = false,
  delSend = true
) {
  if (status && content.length > 700) {
    return WAPI.scope(undefined, true, null, 'Use a maximum of 700 characters');
  }

  if (
    status === false &&
    (typeof content != 'string' || content.length === 0)
  ) {
    return WAPI.scope(
      undefined,
      true,
      null,
      'It is necessary to write a text!'
    );
  }

  if (status == false && (typeof to != 'string' || to.length === 0)) {
    return WAPI.scope(to, true, 404, 'It is necessary to number');
  }

  const chat = checkNumber
    ? await WAPI.sendExist(to)
    : await WAPI.returnChat(to);

  if (chat && chat.status != 404 && chat.id) {
    const t = status != false ? 'sendStatusText' : 'sendText';
    const m = { type: t, text: content };
    const newMsgId = !passId
      ? await window.WAPI.getNewMessageId(chat.id._serialized, checkNumber)
      : await window.WAPI.setNewMessageId(passId, checkNumber);
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();

    let inChat = await WAPI.getchatId(chat.id).catch(() => {
      return WAPI.scope(chat.id, true, 404, 'Error to number ' + to);
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
      return WAPI.scope(to, true, 404, 'Error to gerate newId');
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
      type: 'chat'
    };

    if (forcingReturn) {
      if (delSend) {
        while (true) {
          const connection = window.Store.State.Socket.state;
          if (connection === 'CONNECTED') {
            const result = await window.Store.addAndSendMsgToChat(
              chat,
              message
            );
            await WAPI.sleep(5000);
            const statusMsg = chat.msgs._models.filter(
              (e) => e.id === newMsgId._serialized && e.ack > 0
            );
            if (statusMsg.length === 0) {
              await WAPI.deleteMessages(to, [newMsgId._serialized]);
            } else {
              let obj = WAPI.scope(
                newMsgId,
                false,
                WAPI._serializeForcing(result),
                content
              );
              Object.assign(obj, m);
              return obj;
            }
          }
        }
      } else {
        const result = await window.Store.addAndSendMsgToChat(chat, message);
        let obj = WAPI.scope(
          newMsgId,
          false,
          WAPI._serializeForcing(result),
          content
        );
        Object.assign(obj, m);
        return obj;
      }
    }

    try {
      const result = (
        await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
      )[1];

      if (result === 'success' || result === 'OK') {
        const obj = WAPI.scope(newMsgId, false, result, content);
        Object.assign(obj, m);
        return obj;
      }
      if (result === 'ERROR_UNKNOWN' && to.includes('@g.us')) {
        const obj = WAPI.scope(
          newMsgId,
          true,
          result,
          'Could not send message to this group, possibly you have been removed'
        );
        Object.assign(obj, m);
        return obj;
      }
    } catch (result) {
      let res = result;
      if (result?.contact?.id) {
        res = result.contact.id;
      }
      if (result?.message) {
        res.message = result.message;
      }
      const obj = WAPI.scope(newMsgId, true, res, 'The message was not sent');
      Object.assign(obj, m);
      return obj;
    }
  } else {
    if (!chat.erro) {
      chat.erro = true;
    }
    return chat;
  }
}
