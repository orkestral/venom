export async function pollCreation(idUser, poll) {
  if (typeof poll !== 'object') {
    return WAPI.scope(idUser, true, 404, 'poll must be an object')
  }
  if (!poll?.name) {
    return WAPI.scope(idUser, true, 404, 'Missing object name')
  }
  if (!poll?.options) {
    return WAPI.scope(idUser, true, 404, 'Missing object options')
  }
  if (
    typeof poll.selectableOptionsCount !== 'number' ||
    (poll.selectableOptionsCount !== 1 && poll.selectableOptionsCount !== 0)
  ) {
    return WAPI.scope(
      idUser,
      true,
      404,
      'Error checking selectableOptionsCount!'
    )
  }

  const options = poll.options
  if (Array.isArray(options) && options.length > 0) {
    for (const index in options) {
      if (typeof options[index] !== 'function') {
        if (!options[index].name) {
          return WAPI.scope(idUser, true, 404, 'Missing object name')
        }
        if (typeof options[index].name !== 'string') {
          return WAPI.scope(idUser, true, 404, 'Passed string value in name')
        }
      }
    }
  }

  const chat = await WAPI.sendExist(idUser)
  if (chat && chat.status !== 404 && chat.id) {
    await Store.Survey.sendPollCreation({
      chat: chat,
      poll: poll,
      quotedMsg: null,
    })
    return { error: false, lastReceivedKey: chat.lastReceivedKey }
  } else {
    if (!chat.error) {
      chat.error = true
    }
    return chat
  }
}
