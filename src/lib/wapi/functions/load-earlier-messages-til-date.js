export async function loadEarlierMessagesTillDate(id, lastMessage, done) {
  const found = await WAPI.getChat(id)
  const x = function () {
    if (
      found.msgs.models[0].t > lastMessage &&
      !found.msgs.msgLoadState.noEarlierMsgs
    ) {
      found.onEmptyMRM().then(x)
    } else {
      done()
    }
  }
  x()
}
