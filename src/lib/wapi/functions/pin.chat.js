export async function pinChat(idUser, type) {
  const chat = await WAPI.sendExist(idUser);
  if (typeof type !== 'boolean') {
    return WAPI.scope(
      undefined,
      true,
      null,
      'Use true to pin or false to unpin'
    );
  }
  if (chat && chat.status != 404) {
    const pin = await window.chatOptions.pinChat(chat, type);
    return WAPI.scope(undefined, false, pin, undefined);
  } else {
    return chat;
  }
}
