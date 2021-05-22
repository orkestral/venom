export function processMessageObj(messageObj, includeMe, includeNotifications) {
  if (messageObj.isNotification) {
    if (includeNotifications) return WAPI._serializeMessageObj(messageObj);
    else return;
    // System message
    // (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
  } else if (messageObj.id.fromMe === false || includeMe) {
    return WAPI._serializeMessageObj(messageObj);
  }
  return;
}
