export async function areAllMessagesLoaded(id, done) {
  const found = await WAPI.getChat(id)
  if (!found.msgs.msgLoadState.noEarlierMsgs) {
    if (done) done(false)
    return false
  }
  if (done) done(true)
  return true
}
