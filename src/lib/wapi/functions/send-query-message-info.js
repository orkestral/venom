export async function sendQueryMsgInfo(msgId) {
  var result = await window.Store.sendQueryMsgInfo(msgId)
  return result
}
