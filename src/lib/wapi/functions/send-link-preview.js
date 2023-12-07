export async function sendLinkPreview(chatId, url, text, body, thumbnail) {
  text = text || '';
  const _Path = {
    Protocol: '^(https?:\\/\\/)?',
    Domain: '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|',
    IP: '((\\d{1,3}\\.){3}\\d{1,3}))',
    Port: '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*',
    Query: '(\\?[;&a-z\\d%_.~+=-]*)?',
    End: '(\\#[-a-z\\d_]*)?$',
    Reg: () => {
      return new RegExp(
        _Path.Protocol +
          _Path.Domain +
          _Path.IP +
          _Path.Port +
          _Path.Query +
          _Path.End,
        'i'
      );
    }
  };
  if (!_Path.Reg().test(url)) {
    var text =
      'Use a valid HTTP protocol. Example: https://www.youtube.com/watch?v=V1bFr2SWP1';
    return WAPI.scope(chatId, true, null, text);
  }

  var chat = await WAPI.sendExist(chatId);
  if (!chat.erro) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
    let inChat = await WAPI.getchatId(chat.id).catch(() => {});
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized;
      chat.lastReceivedKey.id = inChat.id;
    }
    const link = await window.Store.Validators.findLink(url);
    const message = {
      id: newMsgId,
      links: link,
      ack: 0,
      body: body.includes(url) ? body : url + "\n" + body,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      isNewMsg: !0,
      type: 'chat',
      subtype: 'url',
      preview: true,
      disappearingModeInitiator: 'chat',
      thumbnail: thumbnail,
      content: url,
      canonicalUrl: url,
      description: url,
      matchedText: url,
      title: text
    };
    const result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1];
    let m = { type: 'LinkPreview', url: url, text: text };
    if (
      result === 'success' ||
      result === 'OK' ||
      result.messageSendResult === 'OK'
    ) {
      let obj = WAPI.scope(newMsgId, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      let obj = WAPI.scope(newMsgId, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
