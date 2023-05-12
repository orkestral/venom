export async function deleteMessagesMe(chatId, messageArray, revoke) {
  return WPP.chat.deleteMessage(chatId, messageArray, true, revoke);
}
