export async function getMessageById(
  key,
  done,
  serialize = true,
  limitIterationFindMessage = 1
) {
  // Check message is loaded in store
  let msg = window.Store.Msg.get(key)

  if (!msg) {
    if (!key.contains('@c.us') && !key.contains('@g.us')) {
      return { erro: 'invalid key: without chatId' }
    }

    // Capture chatId from id of message
    const splitKey = key.replace('true_', '').replace('false_', '').split('@')
    const chatId = splitKey[0] + '@' + splitKey[1].split('_')[0]

    let chat
    try {
      chat = window.Store.Chat.get(chatId)
    } catch (err) {
      return { erro: 'error trying to find chat' }
    }

    if (!chat) {
      return { erro: 'chat not found' }
    }

    let i = 0
    while (
      limitIterationFindMessage === 0 ||
      ++i <= limitIterationFindMessage
    ) {
      msg = window.Store.Msg.get(key)
      if (msg) {
        break
      }
      const msgs = await window.Store.ChatLoadMessages.loadEarlierMsgs(chat)
      if (!msgs || msgs.length === 0) {
        return { erro: 'message not found' }
      }
    }
  }

  if (!msg) {
    return { erro: 'message not found' }
  }

  let result = { erro: 'message not found' }

  if (serialize) {
    try {
      result = await WAPI.processMessageObj(msg, true, true)
    } catch (err) {}
  } else {
    result = msg
  }

  if (typeof done === 'function') {
    done(result)
  } else {
    return result
  }
}
