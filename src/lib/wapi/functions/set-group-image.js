/**
 * Parameters to change group image
 * @param {object} path of image
 * @param {string} groupId group number
 */
export async function setGroupImage(obj, groupId) {
  const nameFunc = new Error().stack
    .match(/at (.*?) /)[1]
    .replace('Object.', '');
  if (typeof groupId !== 'string' || groupId.length === 0) {
    return WAPI.scope(groupId, true, 400, 'You must pass the group groupId!');
  }
  const chat = await WAPI.sendExist(groupId);
  if (chat && chat.status != 404) {
    groupId = new Store.WidFactory.createWid(groupId);
    let base64 = 'data:image/jpeg;base64,';
    try {
      const sendPinture = await Store.Profile.sendSetPicture(
        groupId,
        base64 + obj.b,
        base64 + obj.a
      );
      return WAPI.scope(
        groupId,
        false,
        200,
        `Image changed successfully`,
        nameFunc,
        sendPinture
      );
    } catch {
      return WAPI.scope(
        groupId,
        true,
        400,
        `Unable to change image`,
        nameFunc,
        null
      );
    }
  } else {
    return chat;
  }
}
