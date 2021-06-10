export async function sendMessage(to, content, status = false, passId) {
  if (status && content.length > 700) {
    return WAPI.scope(undefined, true, null, 'Use a maximum of 700 characters');
  }

  if (status && (typeof content != 'string' || content.length === 0)) {
    return WAPI.scope(
      undefined,
      true,
      null,
      'It is necessary to write a text!'
    );
  }

  if (status == false && (typeof content != 'string' || content.length === 0)) {
    return WAPI.scope(to, true, 404, 'It is necessary to write a text!');
  }

  const chat = await WAPI.sendExist(to);

  if (chat && chat.status != 404) {
    const t = status != false ? 'sendStatusText' : 'sendText';
    const m = { type: t, text: content };
    const newMsgId = !passId
      ? await window.WAPI.getNewMessageId(chat.id)
      : await window.WAPI.setNewMessageId(passId);
    const fromwWid = await window.Store.Conn.wid;
    let inChat = await WAPI.getchatId(to).catch(() => {});
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
    };

    var result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1];

    if (result === 'success' || result === 'OK') {
      let obj = WAPI.scope(newMsgId, false, result, content);
      Object.assign(obj, m);
      return obj;
    } else {
      let obj = WAPI.scope(newMsgId, true, result, content);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
