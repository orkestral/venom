export async function sendMessageWithTags(to, body) {
  var chat = to.id ? to : Store.Chat.get(to);
  var chatId = chat.id._serialized;
  var msgIveSent = chat.msgs.filter((msg) => msg.__x_isSentByMe)[0];
  if (!msgIveSent) {
    return chat.sendMessage(body);
  }

  var tempMsg = Object.create(msgIveSent);
  var newId = await window.WAPI.getNewMessageId(chatId);
  var mentionedJidList =
    body
      .match(/@(\d*)/g)
      .map((x) => new Store.WidFactory.createUserWid(x.replace('@', ''))) ||
    undefined;

  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: new Store.WidFactory.createWid(chatId),
    isNewMsg: !0,
    type: 'chat',
    body,
    quotedMsg: null,
    mentionedJidList,
  };

  Object.assign(tempMsg, extend);
  await Store.addAndSendMsgToChat(chat, tempMsg);
  return newId._serialized;
}
