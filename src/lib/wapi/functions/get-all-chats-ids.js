export const getAllChatIds = function (done) {
  const chatIds = window.Store.Chat.map(
    (chat) => chat.id._serialized || chat.id
  );

  if (done !== undefined) done(chatIds);
  return chatIds;
};
