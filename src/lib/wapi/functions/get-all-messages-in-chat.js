export async function getAllMessagesInChat(
  id,
  includeMe = true,
  includeNotifications = true,
  done
) {
  const chat = typeof id === 'string' ? await WAPI.getChat(id) : false
  if (
    chat &&
    typeof includeMe === 'boolean' &&
    typeof includeNotifications === 'boolean'
  ) {
    const output = []
    const messages = chat.msgs._models

    for (const i in messages) {
      if (i === 'remove') {
        continue
      }
      const messageObj = messages[i]

      const message = await WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      )
      if (message) output.push(message)
    }
    if (done !== undefined) done(output)
    return output
  } else {
    return await WAPI.sendExist(id)
  }
}
