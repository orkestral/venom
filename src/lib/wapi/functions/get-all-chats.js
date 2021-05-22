export const getAllChats = function (done) {
  const chats = window.Store.Chat.map((chat) => WAPI._serializeChatObj(chat));

  if (done !== undefined) done(chats);
  return chats;
};
