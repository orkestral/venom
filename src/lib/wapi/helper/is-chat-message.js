export function isChatMessage(message) {
  if (message.isSentByMe) {
    return false
  }
  if (message.isNotification) {
    return false
  }
  if (!message.isUserCreatedType) {
    return false
  }
  return true
}
