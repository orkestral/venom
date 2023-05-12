export function getUnreadMessagesInChat(
  id,
  includeMe,
  includeNotifications,
  done
) {
  // get chat and its messages
  let chat = WAPI.getChat(id);
  let messages = chat.msgs._models;

  // initialize result list
  let output = [];

  // look for unread messages, newest is at the end of array
  for (let i = messages.length - 1; i >= 0; i--) {
    // system message: skip it
    if (i === 'remove') {
      continue;
    }

    // get message
    let messageObj = messages[i];

    // found a read message: stop looking for others
    if (
      typeof messageObj.isNewMsg !== 'boolean' ||
      messageObj.isNewMsg === false
    ) {
      continue;
    } else {
      messageObj.isNewMsg = false;
      // process it
      let message = WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      );

      // save processed message on result list
      if (message) output.push(message);
    }
  }
  // callback was passed: run it
  if (done !== undefined) done(output);
  // return result list
  return output;
}
