export async function startTyping(chatId) {
  await Store.ChatStates.sendChatStateComposing(chatId);
}

/**
 * Stops typing
 * @param {string} chatId
 */
export async function stopTyping(chatId) {
  await Store.ChatStates.sendChatStatePaused(chatId);
}
