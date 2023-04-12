export async function forwardMessages(chatId, messages, skipMyMessages) {
  var chat = await WAPI.sendExist(chatId);

  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  var toForward = (
    await Promise.all(
      messages.map(async (msg) => {
        return await WAPI.getMessageById(msg, null, false);
      })
    )
  ).filter((msg) => (skipMyMessages ? !msg.__x_isSentByMe : true));

  var m = { type: 'forwardMessages' };

  return new Promise(async (resolve, reject) => {
    let newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    let inChat = await WAPI.getchatId(chat.id).catch(() => {});
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }
    if (chat.id) {
      await Promise.each(toForward, async (e) => {
        if (typeof e.erro !== 'undefined' && e.erro === true) {
          var obj = WAPI.scope(chatId, true, null, 'message not found');
          Object.assign(obj, m);
          reject(obj);
          return;
        }

        let tempMsg = await Object.create(
          chat.msgs.filter((msg) => msg.__x_isSentByMe)
        )[0];
        const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
        let toFor = await Object.assign(e);
        let extend = {
          id: newMsgId,
          ack: 0,
          from: fromwWid,
          to: chat.id,
          local: !0,
          self: 'out',
          t: parseInt(new Date().getTime() / 1000),
          isNewMsg: !0,
          isForwarded: true,
          forwardingScore: 1,
          multicast: true,
          __x_isSentByMe: true
        };

        Object.assign(tempMsg, toFor);
        Object.assign(tempMsg, extend);

        return await Store.addAndSendMsgToChat(chat, tempMsg);
      })
        .then(async () => {
          var obj = WAPI.scope(newMsgId, false, 200, null);
          Object.assign(obj, m);
          resolve(obj);
        })
        .catch(() => {
          var obj = WAPI.scope(newMsgId, true, 404, null);
          Object.assign(obj, m);
          reject(obj);
        });
    } else {
      reject(chat);
    }
  });
}
