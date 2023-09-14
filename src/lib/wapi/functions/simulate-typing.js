export async function startTyping(chatId) {
  const chat = window.Store.WidFactory.createWid(chatId);
  if (!chat) {
    throw {
      error: true,
      code: 'chat_not_found',
      message: 'Chat not found',
      chatId: chatId
    };
  }
  await Store.ChatState.sendChatStateComposing(chat);
  return { status: 200 };
}
