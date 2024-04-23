export async function getNumberProfile(id) {
  if (typeof id != 'string' || id.length === 0) {
    return WAPI.scope(id, true, 404, 'It is necessary to number')
  }
  const chat = await WAPI.sendExist(id)
  if (chat && chat.status != 404 && chat.id) {
    const infoUser = await Store.MyStatus.getStatus(chat)
    return await WAPI._serializeMeObj(infoUser)
  }
  if (!chat.erro) {
    chat.erro = true
  }
  return chat
}
