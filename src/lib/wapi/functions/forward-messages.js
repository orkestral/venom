export async function forwardMessages(
  chatId,
  messages,
  skipMyMessages,
  limitIterationFindMessage = 1
) {
  var chat = await WAPI.sendExist(chatId)

  if (!Array.isArray(messages)) {
    messages = [messages]
  }

  const messagesObjs = []
  for (const msgIdOrMsgObj of messages) {
    const msgId = msgIdOrMsgObj.id ? msgIdOrMsgObj.id : msgIdOrMsgObj
    const msg = await WAPI.getMessageById(
      msgId,
      null,
      false,
      limitIterationFindMessage
    )
    if (skipMyMessages && msg.id.fromMe) {
      continue
    }
    messagesObjs.push({ id: msgId, obj: msg, passId: msgIdOrMsgObj.passId })
  }

  var m = { type: 'forwardMessages', messages: [] }

  if (messagesObjs.length === 0) {
    m.error = await WAPI.scope(chatId, true, 412, 'Empty messages array')
  }

  return new Promise(async (resolve, reject) => {
    const inChat = await WAPI.getchatId(chat.id).catch(() => {})
    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized
      chat.lastReceivedKey.id = inChat.id
    }
    if (chat.id) {
      for (const msg of messagesObjs) {
        try {
          if (typeof msg.obj.erro !== 'undefined') {
            const msgResponse = {
              id: msg.id,
              scope: await WAPI.scope(msg.id, true, null, msg.obj.erro),
            }
            m.messages.push(msgResponse)
            continue
          }

          const newMsgId = !msg.passId
            ? await window.WAPI.getNewMessageId(chat.id._serialized, true)
            : await window.WAPI.setNewMessageId(msg.passId, true)
          const tempMsg = {}
          const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
          const toFor = await Object.assign(msg.obj.attributes)
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
            const msgResponse = {
              id: msg.id,
              newId: newMsgId,
              scope: await WAPI.scope(
                msg.id,
                true,
                500,
                response[1].messageSendResult
              ),
            }
            m.messages.push(msgResponse)
            continue
          }

          const msgResponse = {
            id: msg.id,
            newId: newMsgId,
            scope: await WAPI.scope(
              msg.id,
              false,
              200,
              response[1].messageSendResult
            ),
          }

          m.messages.push(msgResponse)
        } catch (error) {
          const duplicated = error.name === 'DuplicateMessageError'
          const msgResponse = {
            id: msg.id,
            scope: await WAPI.scope(
              msg.id,
              true,
              duplicated ? 409 : 500,
              duplicated ? error.name : 'error sending message'
            ),
          }
          m.messages.push(msgResponse)
          continue
        }
      }
      resolve(m)
    } else {
      m.error = await WAPI.scope(chatId, true, 412, 'chat not found')
      reject(m)
    }
  })
}
