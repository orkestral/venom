export async function loadChatEarlierMessages(id) {
  const chat = await WAPI.getChat(id);
  if (chat) {
    const someEarlierMessages = await chat.onEmptyMRM();
    if (someEarlierMessages) {
      const serializeMessageObj = await WAPI._serializeMessageObj;
      return someEarlierMessages.map(serializeMessageObj);
    }
  }
  return false;
}
