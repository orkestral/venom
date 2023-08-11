/**
 * Sends an existence check for a given chat ID and returns the result.
 * @param chatId The ID of the chat to check.
 * @param returnChat Whether to return the chat object if it exists.
 * @param Send Whether to send a "seen" confirmation to the chat.
 * @returns The result of the existence check or the chat object if returnChat is true.
 */
export async function sendExist(chatId, returnChat = true, Send = true) {
  const checkType = await WAPI.sendCheckType(chatId);

  // Check if chatId does not exist
  if (!!checkType && checkType.status === 404) {
    return checkType;
  }

  let ck = await WAPI.checkNumberStatus(chatId, false);

  // Check if chatId does not exist and it's not a group or broadcast
  if (
    (ck.status === 404 &&
      !chatId.includes('@g.us') &&
      !chatId.includes('@broadcast')) ||
    (ck &&
      ck.text &&
      typeof ck.text.includes === 'function' &&
      ck.text.includes('XmppParsingFailure'))
  ) {
    return WAPI.scope(chatId, true, ck.status, 'The number does not exist');
  }

  const chatWid = new Store.WidFactory.createWid(chatId);

  let chat =
    ck && ck.id && ck.id._serialized
      ? await WAPI.getChat(ck.id._serialized)
      : undefined;

  // Check if chat exists using the serialized ID
  if (ck.numberExists && chat === undefined) {
    var idUser = new Store.UserConstructor(chatId, {
      intentionallyUsePrivateConstructor: true
    });
    await Store.Chat.add(
      {
        createdLocally: true,
        id: chatWid
      },
      {
        merge: true
      }
    );
    chat = await Store.Chat.find(idUser);
  }

  if (!chat) {
    await Store.Chat.add(
      {
        createdLocally: true,
        id: chatWid
      },
      {
        merge: true
      }
    );
    const storeChat = await Store.Chat.find(chatWid);

    // Retrieve chat using the storeChat object
    if (storeChat) {
      chat =
        storeChat && storeChat.id && storeChat.id._serialized
          ? await WAPI.getChat(storeChat.id._serialized)
          : undefined;
    }
  }

  // Check if the number does not exist and it's a user chat
  if (!ck.numberExists && !chat.t && chat.isUser) {
    return WAPI.scope(chatId, true, ck.status, 'The number does not exist');
  }

  // Check if the number does not exist and it's a group chat
  if (!ck.numberExists && !chat.t && chat.isGroup) {
    return WAPI.scope(
      chatId,
      true,
      ck.status,
      'The group number does not exist on your chat list, or it does not exist at all!'
    );
  }

  if (!chat) {
    return WAPI.scope(chatId, true, 404);
  }

  // Send a "seen" confirmation to the chat if Send is true
  if (Send) {
    await Store.ReadSeen.sendSeen(chat, false);
  }

  // Return the chat object if returnChat is true
  if (returnChat) {
    return chat;
  }

  return WAPI.scope(chatId, false, 200);
}
