export async function getMessageById(key, done, serialize = true) {
  // Check message is loaded in store
  let msg = window.Store.Msg.get(key)
  const erro = { erro: true }

  if (!msg) {
    // Get chat of message

    const chatId = key.replace(/(true_|false_)/, '').split('@c.us')[0] + '@c.us'

    const chat = window.Store.Chat.get(chatId)
    if (!chat) {
      return erro
    }

    //If not message not found, load latest messages of chat
    await chat.onEmptyMRM()
    await WAPI.sleep(100)
    msg = window.Store.Msg.get(key)

    /* if (!msg) {
      // If not found, load messages around the message ID
      // NOTE - new Module and method: WAWebChatMessageSearch. Now needs (chat, key)
      // key is gotten by Store.MsgKey.fromString('false_556481422014@c.us_64CCB294FAADBDBED8') - a serializable
      // However, I don't think is working properly
      const context = chat.getSearchContext(key)
      if (
        context &&
        context.collection &&
        context.collection.loadAroundPromise
      ) {
        await context.collection.loadAroundPromise
      }
      msg = window.Store.Msg.get(key)
    } */
  }

  if (!msg) {
    return erro
  }

  let result = erro

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
