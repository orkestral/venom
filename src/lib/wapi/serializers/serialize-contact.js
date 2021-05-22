export const _serializeContactObj = (obj) => {
  if (obj == undefined) {
    return null;
  }

  if (!obj.profilePicThumb && obj.id && window.Store.ProfilePicThumb) {
    obj.profilePicThumb = window.Store.ProfilePicThumb.get(obj.id);
  }

  return Object.assign(window.WAPI._serializeRawObj(obj), {
    formattedName: obj.formattedName,
    isHighLevelVerified: obj.isHighLevelVerified,
    isMe: obj.isMe,
    isMyContact: obj.isMyContact,
    isPSA: obj.isPSA,
    isUser: obj.isUser,
    isVerified: obj.isVerified,
    isWAContact: obj.isWAContact,
    profilePicThumbObj: obj.profilePicThumb
      ? WAPI._serializeProfilePicThumb(obj.profilePicThumb)
      : {},
    statusMute: obj.statusMute,
    msgs: null,
  });
};
