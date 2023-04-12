export function processMessageObj(messageObj, includeMe, includeNotifications) {
  if (messageObj.isNotification) {
    if (includeNotifications) {
      return WAPI._serializeMessageObj(messageObj);
    } else {
      return;
    }
  } else if (messageObj.id.fromMe === false || includeMe) {
    return WAPI._serializeMessageObj(messageObj);
  }
  return;
}
