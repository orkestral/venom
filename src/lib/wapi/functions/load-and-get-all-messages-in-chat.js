export async function loadAndGetAllMessagesInChat(
  id,
  includeMe,
  includeNotifications
) {
  return WAPI.loadAllEarlierMessages(id).then(() => {
    const chat = WAPI.getChat(id);
    let output = [];
    const messages = chat.msgs._models;

    for (const i in messages) {
      if (i === 'remove') {
        continue;
      }
      const messageObj = messages[i];

      let message = WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      );
      if (message) output.push(message);
    }
    return output;
  });
}
