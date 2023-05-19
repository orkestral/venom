export const serializeChatObj = (obj) => {
  if (obj == undefined) {
    return null;
  }
  return Object.assign(WAPI.serializeRawObj(obj), {
    kind: obj.kind,
    isGroup: obj.isGroup,
    contact: obj['contact'] ? WAPI.serializeContactObj(obj['contact']) : null,
    groupMetadata: obj['groupMetadata']
      ? WAPI.serializeRawObj(obj['groupMetadata'])
      : null,
    presence: obj['presence'] ? WAPI.serializeRawObj(obj['presence']) : null,
    msgs: null,
    isOnline: obj.__x_presence.attributes.isOnline || null,
    lastSeen:
      obj &&
      obj.previewMessage &&
      obj.previewMessage.__x_ephemeralStartTimestamp
        ? obj.previewMessage.__x_ephemeralStartTimestamp * 1000
        : null
  });
};
