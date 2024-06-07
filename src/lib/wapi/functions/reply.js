export async function reply(
  chatId,
  content,
  quotedMessageId,
  passId,
  checkNumber = true,
  limitIterationFindMessage
) {
  try {
    if (typeof chatId != 'string') {
      return WAPI.scope(
        null,
        true,
        404,
        'enter the chatid variable as an string'
      )
    }
    if (typeof content != 'string') {
      return WAPI.scope(
        null,
        true,
        404,
        'enter the content variable as an string'
      )
    }
    if (typeof quotedMessageId != 'string') {
      return WAPI.scope(
        null,
        true,
        404,
        'enter the content variable as an string'
      )
    }
    const chat = await WAPI.sendExist(chatId)
    if (chat && chat.status != 404) {
      const To = chat.id
      const m = { type: 'deleteMessages' }

      const quotedMessage = await WAPI.getMessageById(
        quotedMessageId,
        null,
        false,
        limitIterationFindMessage
      )
      if (quotedMessage.erro) {
        const obj = WAPI.scope(
          To,
          true,
          404,
          `The id ${quotedMessageId} does not exist!`
        )
        Object.assign(obj, m)
        return obj
      }

      const newMsgId = !passId
        ? await window.WAPI.getNewMessageId(chat.id._serialized, checkNumber)
        : await window.WAPI.setNewMessageId(passId, checkNumber)

      const inChat = await WAPI.getchatId(chat.id).catch(() => {})
      if (inChat) {
        chat.lastReceivedKey._serialized = inChat._serialized
        chat.lastReceivedKey.id = inChat.id
      }

      const k = {
        linkPreview: undefined,
        quotedMsg: quotedMessage,
        mentionedJidList: [],
        groupMentions: [],
        quotedMsgAdminGroupJid: undefined,
        quotedMsgAdminGroupSubject: undefined,
        quotedMsgAdminParentGroupJid: undefined,
        ctwaContext: undefined,
      }

      const message = await Store.createTextMsgData(chat, content, k)
      message.id = newMsgId

      const result = (
        await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
      )[1]

      if (
        result === 'success' ||
        result === 'OK' ||
        result.messageSendResult === 'OK'
      ) {
        const obj = WAPI.scope(newMsgId, false, result, '')
        Object.assign(obj, m)
        return obj
      } else {
        const obj = WAPI.scope(newMsgId, true, result, '')
        Object.assign(obj, m)
        return obj
      }
    } else {
      return chat
    }
  } catch (error) {
    console.log('reply', error)

    return WAPI.scope(null, true, 500, error.message)
  }
}
