export async function getAllMessagesInChat(
  id,
  includeMe = true,
  includeNotifications = true,
  done
) {
  const chat = typeof id === 'string' ? await WAPI.getChat(id) : false;
  if (
    chat &&
    typeof includeMe === 'boolean' &&
    typeof includeNotifications === 'boolean'
  ) {
    let output = [];
    let msg = await chat.getAllMsgs();
    if (msg && msg.length > 0) {
      msg = msg[0].collection._models;
    } else {
      msg = [];
    }
    const messages =
      msg.length > chat.msgs._models.length ? msg : chat.msgs._models;

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
    if (done !== undefined) done(output);
    return output;
  } else {
    return await WAPI.sendExist(id);
  }
}
