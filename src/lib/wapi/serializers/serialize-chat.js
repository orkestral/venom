import { _serializeRawObj } from './serialize-raw';
/**
 * Serializes a chat object
 * @param rawChat Chat object
 * @returns {Chat}
 */
export const _serializeChatObj = (obj) => {
  if (obj == undefined) {
    return null;
  }
  return Object.assign(window.WAPI._serializeRawObj(obj), {
    kind: obj?.kind,
    isGroup: obj?.isGroup,
    contact: obj?.contact
      ? window.WAPI._serializeContactObj(obj?.contact)
      : null,
    groupMetadata: obj?.groupMetadata
      ? window.WAPI._serializeRawObj(obj?.groupMetadata)
      : null,
    presence: obj?.presence
      ? window.WAPI._serializeRawObj(obj?.presence)
      : null,
    msgs: null,
    tcToken: null,
    isOnline: obj?.__x_presence?.attributes?.isOnline || null,
    lastSeen: obj?.previewMessage?.__x_ephemeralStartTimestamp
      ? obj.previewMessage.__x_ephemeralStartTimestamp * 1000
      : null
  });
};
