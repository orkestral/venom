export async function getNewMessageId(chatId, checkNumber = true) {
  const chat = checkNumber
    ? await WAPI.sendExist(chatId)
    : await WAPI.returnChat(chatId)
  if (chat.id) {
    const newMsgId = new Object()
    newMsgId.fromMe = true
    newMsgId.id = await WAPI.getNewId().toUpperCase()
    newMsgId.remote = new Store.WidFactory.createWid(chat.id._serialized)
    newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`
    const Msgkey = new Store.MsgKey(newMsgId)
    return Msgkey
  } else {
    return false
  }
}
