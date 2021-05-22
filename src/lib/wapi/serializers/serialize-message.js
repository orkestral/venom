export const _serializeMessageObj = (obj) => {
  if (obj == undefined) {
    return null;
  }
  const _chat = obj['chat'] ? WAPI._serializeChatObj(obj['chat']) : {};
  if (obj.quotedMsg) obj.quotedMsgObj();
  return Object.assign(window.WAPI._serializeRawObj(obj), {
    id: obj.id._serialized,
    from: obj.from._serialized,
    quotedParticipant: obj.quotedParticipant
      ? obj.quotedParticipant._serialized
        ? obj.quotedParticipant._serialized
        : undefined
      : undefined,
    author: obj.author
      ? obj.author._serialized
        ? obj.author._serialized
        : undefined
      : undefined,
    chatId:
      obj.id && obj.id.remote
        ? obj.id.remote
        : obj.chatId && obj.chatId._serialized
        ? obj.chatId._serialized
        : undefined,
    to: obj.to
      ? obj.to._serialized
        ? obj.to._serialized
        : undefined
      : undefined,
    fromMe: obj.id.fromMe,
    sender: obj['senderObj']
      ? WAPI._serializeContactObj(obj['senderObj'])
      : null,
    timestamp: obj['t'],
    content: obj['body'],
    isGroupMsg: obj.isGroupMsg,
    isLink: obj.isLink,
    isMMS: obj.isMMS,
    isMedia: obj.isMedia,
    isNotification: obj.isNotification,
    isPSA: obj.isPSA,
    type: obj.type,
    chat: _chat,
    isOnline: _chat.isOnline,
    lastSeen: _chat.lastSeen,
    quotedMsgObj: WAPI._serializeMessageObj(obj['_quotedMsgObj']),
    mediaData: window.WAPI._serializeRawObj(obj['mediaData']),
    reply: (body) => window.WAPI.reply(_chat.id._serialized, body, obj),
  });
};
