/**
 * open chat!
 * @param {string} chatId Chat id
 */
export async function openChat(chatId, force = false) {
  if (force) {
    const chat = await WAPI.getChat(chatId);
    const result = await Store.Cmd.openChatBottom(chat);
    return WAPI.scope(undefined, false, result);
  }

  if (typeof chatId != 'string' || chatId.length === 0) {
    return WAPI.scope(chatId, true, 404, 'It is necessary to number');
  }

  const chat = await WAPI.sendExist(chatId);
  if (chat && chat.status != 404 && chat.id) {
    const chat = Store.Chat.get(chatId);
    const result = Store.Cmd.default.openChatBottom(chat);
    return WAPI.scope(undefined, false, result);
  }
  if (!chat.erro) {
    chat.erro = true;
  }
  return chat;
}

/**
 * Opens chat at given message position
 * This is a UI proccess, use this in a queue
 * @param {string} chatId Chat id
 * @param {string} messageId Message id: (For example: '06D3AB3D0EEB9D077A3F9A3EFF4DD030')
 * @returns {{wasVisible: boolean, alignAt: string}}: {wasVisible: false, alignAt: "center"}
 */
export async function openChatAt(chatId, messageId) {
  const chat = Store.Chat.get(chatId);
  const atMessage = chat.msgs.models.find((model) => model.id.id === messageId);
  const args = {
    collection: chat.msgs,
    msg: atMessage,
    isUnreadDivider: false
  };
  const result = await Store.Cmd.default._openChat(chat, args);
  return result;
}
