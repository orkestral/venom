window.WAPI.sendPaymentRequest = async function (
  chatId,
  amount1000,
  currency,
  noteMessage
) {
  var chat = Store.Chat.get(chatId)
  var tempMsg = Object.create(chat.msgs.filter((msg) => msg.__x_isSentByMe)[0])
  var newId = window.WAPI.getNewMessageId(chat.id._serialized)
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: chatId,
    isNewMsg: !0,
    type: 'payment',
    subtype: 'request',
    amount1000,
    requestFrom: chatId,
    currency,
    noteMessage,
    expiryTimestamp: parseInt(
      new Date(new Date().setDate(new Date().getDate() + 1)).getTime() / 1000
    ),
  }
  Object.assign(tempMsg, extend)
  await Store.addAndSendMsgToChat(chat, tempMsg)
}
