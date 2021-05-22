export async function loadChatEarlierMessages(id) {
  const chat = WAPI.getChat(id);
  if (chat) {
    const someEarlierMessages = await chat.loadEarlierMsgs();
    if (someEarlierMessages)
      return someEarlierMessages.map(WAPI._serializeMessageObj);
  }
  return false;
}
