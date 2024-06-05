import { NUMBER_SUFIX } from '../constants/number-suffix'

export async function getNewMessageId(chatId, checkNumber = true) {
  const chat = checkNumber
    ? await WAPI.sendExist(chatId)
    : await WAPI.returnChat(chatId)
  if (chat.id) {
    const remote = new Store.WidFactory.createWid(chat.id._serialized)
    const newMsgId = new Object()
    newMsgId.id = await WAPI.getNewId().toUpperCase()
    if (remote._serialized.contains(NUMBER_SUFIX.GROUP)) {
      newMsgId.from = await Store.MaybeMeUser.getMaybeMeUser()
      newMsgId.to = remote
      newMsgId.selfDir = 'out'
      newMsgId.participant = newMsgId.from
    } else if (remote._serialized.contains(NUMBER_SUFIX.CONTACT)) {
      newMsgId.fromMe = true
      newMsgId.remote = remote
    }
    const Msgkey = new Store.MsgKey(newMsgId)
    return Msgkey
  } else {
    return false
  }
}
