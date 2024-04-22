export async function sendChatstate(state, chatId) {
  switch (state) {
    case '0':
      await window.Store.ChatStates.sendChatStateComposing(chatId)
      break
    case '1':
      await window.Store.ChatStates.sendChatStateRecording(chatId)
      break
    case '2':
      await window.Store.ChatStates.sendChatStatePaused(chatId)
      break
    default:
      return false
  }
  return true
}
