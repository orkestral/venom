import { getAllChatsWithNewMessages } from './get-chats-with-new-messages'

export const getAllNewMessages = async function () {
  const serializeMessageObj = await WAPI._serializeMessageObj
  const _newMessages =
    getAllChatsWithNewMessages()
      .map(async (c) => await WAPI.getChat(c.id))
      .flatMap((c) => c.msgs._models.filter((x) => x.isNewMsg))
      .map(serializeMessageObj) || []

  return _newMessages
}
