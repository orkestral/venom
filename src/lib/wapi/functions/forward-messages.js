export async function forwardMessages(chatId, messages, skipMyMessages) {
  var chat = await WAPI.sendExist(chatId)

  if (!Array.isArray(messages)) {
    messages = [messages]
  }

  const messagesObjs = await Promise.all(
    messages.map(async (el) => {
      const msg = await WAPI.getMessageById(el, null, false)
      if (skipMyMessages && msg.id.fromMe) {
        return
      }
      return { messageId: el, obj: msg }
    })
  )
  messagesObjs.filter((msg) => msg)

  var m = { type: 'forwardMessages', messages: [] }

  return new Promise(async (resolve, reject) => {
    const inChat = await WAPI.getchatId(chat.id).catch(() => {})
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized
      chat.lastReceivedKey.id = inChat.id
    }
    if (chat.id) {
      for (const msg of messagesObjs) {
        try {
          if (typeof msg.obj.erro !== 'undefined' && msg.obj.erro === true) {
            const scope = await WAPI.scope(
              msg.messageId,
              true,
              null,
              'message not found'
            )
            m.messages.push(scope)
            continue
          }

          const newMsgId = await window.WAPI.getNewMessageId(
            chat.id._serialized
          )
          const tempMsg = {}
          const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
          const toFor = await Object.assign(msg.obj)
          const extend = {
            id: newMsgId,
            ack: 0,
            from: fromwWid,
            to: chat.id,
            local: !0,
            self: 'out',
            t: parseInt(new Date().getTime() / 1000),
            isNewMsg: !0,
            isForwarded: true,
            forwardingScore: 1,
            multicast: true,
            __x_isSentByMe: true,
          }

          Object.assign(tempMsg, toFor)
          Object.assign(tempMsg, extend)

          const response = await Promise.all(
            await Store.addAndSendMsgToChat(chat, tempMsg)
          )

          if (response[1].messageSendResult !== 'OK') {
            const scope = await WAPI.scope(
              msg.messageId,
              true,
              500,
              response[1].messageSendResult
            )
            m.messages.push(scope)
            continue
          }

          const scope = await WAPI.scope(
            msg.messageId,
            false,
            200,
            response[1].messageSendResult
          )
          m.messages.push(scope)
        } catch (error) {
          const scope = await WAPI.scope(msg.messageId, true, 404, null)
          m.messages.push(scope)
          continue
        }
      }
      resolve(m)
    } else {
      m.error = await WAPI.scope(chatId, true, null, 'chat not found')
      reject(m)
    }
  })
}
