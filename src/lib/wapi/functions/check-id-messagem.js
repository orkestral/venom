export async function checkIdMessage(chatId, idMesagem) {
  if (typeof chatId != 'string') {
    return WAPI.scope(null, true, 404, 'enter the chatId variable as an string')
  }
  const chat = await WAPI.sendExist(chatId)
  if (chat && chat.status != 404) {
    const getIdMessage = await window.Store.Msg.get(idMesagem)
    if (!getIdMessage) {
      return WAPI.scope(chat, true, 404, `The id ${idMesagem} does not exist!`)
    }
    const To = chat.id
    const m = { type: 'checkIdMessage' }
    const obj = WAPI.scope(To, false, 'OK', '')
    Object.assign(obj, m)
    return obj
  } else {
    return chat
  }
}
