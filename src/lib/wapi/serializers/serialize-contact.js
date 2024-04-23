export const _serializeContactObj = (obj) => {
  if (obj == undefined) {
    return null
  }

  if (!obj.profilePicThumb && obj.id && Store.ProfilePicThumb) {
    obj.profilePicThumb = Store.ProfilePicThumb.get(obj.id)
  }

  return Object.assign(window.WAPI._serializeRawObj(obj), {
    formattedName: obj?.formattedName,
    displayName: obj?.displayName,
    formattedShortName: obj?.formattedShortName,
    formattedShortNameWithNonBreakingSpaces:
      obj?.formattedShortNameWithNonBreakingSpaces,
    isHighLevelVerified: obj?.isHighLevelVerified,
    isMe: obj?.isMe,
    mentionName: obj?.mentionName,
    notifyName: obj?.notifyName,
    isMyContact: obj?.isMyContact,
    isPSA: obj?.isPSA,
    isUser: obj?.isUser ?? obj?.id?.server === 'c.us' ? true : false,
    isVerified: obj?.isVerified,
    isWAContact: obj?.isWAContact,
    profilePicThumbObj: obj?.profilePicThumb
      ? WAPI._serializeProfilePicThumb(obj?.profilePicThumb)
      : {},
    statusMute: obj?.statusMute,
    msgs: null,
  })
}
