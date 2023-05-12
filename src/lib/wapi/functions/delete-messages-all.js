export async function deleteMessagesAll(chatId, messageArray, onlyLocal) {
  return WPP.chat.deleteMessage(chatId, messageArray, true, onlyLocal);
}
