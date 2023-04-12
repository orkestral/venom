export async function returnReply(message) {
  if (typeof message != 'object') {
    return WAPI.scope(
      null,
      true,
      404,
      'enter the message variable as an object'
    );
  }
  if (
    message &&
    message.quotedMsg &&
    message.quotedMsg.type &&
    message.quotedMsgObj
  ) {
    return message.quotedMsgObj;
  } else {
    return false;
  }
}
