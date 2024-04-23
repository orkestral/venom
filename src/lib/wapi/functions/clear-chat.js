export async function clearChatMessages(chatId) {
  const chat = await Store.Chat.get(chatId)
  if (chat) {
    return await Store.ChatUtil.sendClear(chat, chat.lastReceivedKey, true)
  } else {
    return false
  }
}
