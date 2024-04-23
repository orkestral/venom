export async function archiveChat(idUser, type) {
  const chat = await WAPI.sendExist(idUser)
  if (typeof type !== 'boolean') {
    return WAPI.scope(
      undefined,
      true,
      null,
      'Use true to archive or false to unarchive'
    )
  }
  if (chat && chat.status != 404) {
    const archive = await window.chatOptions.archiveChat(chat, type)
    return WAPI.scope(undefined, false, archive, undefined)
  } else {
    return chat
  }
}
