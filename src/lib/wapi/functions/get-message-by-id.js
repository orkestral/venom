export async function getMessageById(key, done, serialize = true) {
  // Check message is loaded in store
  let msg = window.Store.Msg.get(key);
  let erro = { erro: true };

  if (!msg) {
    // Get chat of message
    const chat = window.Store.Chat.get(key.remote);
    if (!chat) {
      return erro;
    }

    //If not message not found, load latest messages of chat
    await chat.loadEarlierMsgs();
    msg = window.Store.Msg.get(key);

    if (!msg) {
      // If not found, load messages around the message ID
      const context = chat.getSearchContext(key);
      if (
        context &&
        context.collection &&
        context.collection.loadAroundPromise
      ) {
        await context.collection.loadAroundPromise;
      }
      msg = window.Store.Msg.get(key);
    }
  }

  if (!msg) {
    return erro;
  }

  let result = erro;

  if (serialize) {
    try {
      result = WAPI.processMessageObj(msg, true, true);
    } catch (err) {}
  } else {
    result = msg;
  }

  if (typeof done === 'function') {
    done(result);
  } else {
    return result;
  }
}
