export const getAllChats = async function (done) {
  const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
  if (fromwWid) {
    const idUser = await WAPI.sendExist(fromwWid._serialized)
    if (idUser && idUser.status !== 404) {
      const chats = window.Store.Chat.map((chat) =>
        WAPI._serializeChatObj(chat)
      )

      if (done !== undefined) done(chats)
      return chats
    }
  }
}
