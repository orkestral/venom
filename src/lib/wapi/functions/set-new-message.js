import { NUMBER_SUFIX } from '../constants/number-suffix'

export async function setNewMessageId(info, checkNumber = true) {
  if (
    info &&
    typeof info === 'object' &&
    info.number &&
    info._serialized &&
    info.id
  ) {
    const chat = checkNumber
      ? await WAPI.sendExist(info.number)
      : await WAPI.returnChat(info.number)
    delete info.number
    if (chat.id) {
      const remote = new Store.WidFactory.createWid(chat.id._serialized)
      const newMsgId = new Object()
      newMsgId.id = info.id
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
  } else {
    return false
  }
}
