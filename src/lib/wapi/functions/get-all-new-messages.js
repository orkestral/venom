import { getAllChatsWithNewMessages } from './get-chats-with-new-messages';

export const getAllNewMessages = function () {
  const _newMessages =
    getAllChatsWithNewMessages()
      .map((c) => WAPI.getChat(c.id))
      .flatMap((c) => c.msgs._models.filter((x) => x.isNewMsg))
      .map(WAPI._serializeMessageObj) || [];

  return _newMessages;
};
