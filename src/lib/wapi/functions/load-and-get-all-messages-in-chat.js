export async function loadAndGetAllMessagesInChat(
  id,
  includeMe,
  includeNotifications
) {
  return new Promise((resolve) => {
    WAPI.loadAllEarlierMessages(id, async (chat) => {
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

        if (message) {
          output.push(message)
        }
      }
      resolve(output)
    })
  })
}
