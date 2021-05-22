import { hasUndreadMessages } from './has-unread-messages';

export const getAllChatsWithNewMessages = function (done) {
  const chats = window.Store.Chat.filter(hasUndreadMessages).map((chat) =>
    WAPI._serializeChatObj(chat)
  );

  if (done !== undefined) done(chats);
  return chats;
};
