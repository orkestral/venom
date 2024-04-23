export async function sendMessageWithThumb(
  thumb,
  url,
  title,
  description,
  chatId,
  done
) {
  var chatSend = await WAPI.getChat(chatId)
  if (chatSend === undefined) {
    if (done !== undefined) done(false)
    return false
  }
  var linkPreview = {
    canonicalUrl: url,
    description: description,
    matchedText: url,
    title: title,
    thumbnail: thumb,
  }
  chatSend.sendMessage(url, {
    linkPreview: linkPreview,
    mentionedJidList: [],
    quotedMsg: null,
    quotedMsgAdminGroupJid: null,
  })
  if (done !== undefined) done(true)
  return true
}
