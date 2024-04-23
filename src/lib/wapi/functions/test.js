/*async function test() {
  const chat = await WAPI.sendExist('556999626866@c.us')

  if (chat && chat.status != 404 && chat.id) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized)
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()

    const inChat = await WAPI.getchatId(chat.id).catch(() => {
      return WAPI.scope(chat.id, true, 404, 'Error to number ' + chat)
    })

    if (inChat) {
      chat.lastReceivedKey && chat.lastReceivedKey._serialized
        ? (chat.lastReceivedKey._serialized = inChat._serialized)
        : ''
      chat.lastReceivedKey && chat.lastReceivedKey.id
        ? (chat.lastReceivedKey.id = inChat.id)
        : ''
    }

    const message = {
      id: newMsgId,
      ack: 0,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      footer: 'test?',
      caption: 'test?',
      body: 'test?',
      text: 'test?',
      type: 'chat',
      isNewMsg: !0,

      isFromTemplate: true,
      isMdHistoryMsg: true,
      hydratedButtons: [
        {
          index: 1,
          quickReplyButton: {
            displayText: 'Sim',
            id: 'ID1',
          },
        },
      ],
    }

    return await window.Store.addAndSendMsgToChat(chat, message)
  }
}*/
