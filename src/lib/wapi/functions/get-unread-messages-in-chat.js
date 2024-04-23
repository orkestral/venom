export async function getUnreadMessagesInChat(
  id,
  includeMe,
  includeNotifications,
  done
) {
  // get chat and its messages
  const chat = await WAPI.getChat(id)
  const messages = chat.msgs._models

  // initialize result list
  const output = []

  // look for unread messages, newest is at the end of array
  for (let i = messages.length - 1; i >= 0; i--) {
    // system message: skip it
    if (i === 'remove') {
      continue
    }

    // get message
    const messageObj = messages[i]

    // found a read message: stop looking for others
    if (
      typeof messageObj.isNewMsg !== 'boolean' ||
      messageObj.isNewMsg === false
    ) {
      continue
    } else {
      messageObj.isNewMsg = false
      // process it
      const message = await WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      )

      // save processed message on result list
      if (message) output.push(message)
    }
  }
  // callback was passed: run it
  if (done !== undefined) done(output)
  // return result list
  return output
}
