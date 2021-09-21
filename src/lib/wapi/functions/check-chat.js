export async function checkChat(id) {
  try {
    if (
      typeof id === 'string' &&
      (id.includes('@g.us') ||
        id.includes('@c.us') ||
        id.includes('@broadcast'))
    ) {
      const chat = await Store.Chat.get(id);
      if (!!chat && chat.t) {
        return WAPI.scope(
          undefined,
          false,
          200,
          null,
          WAPI._serializeChatObj(chat)
        );
      } else {
        throw 404;
      }
    } else {
      throw 400;
    }
  } catch (e) {
    return WAPI.scope(undefined, true, e, 'Was not found');
  }
}
