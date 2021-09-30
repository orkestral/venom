export async function checkNumberStatus(id) {
  const checkType = WAPI.sendCheckType(id);
  if (!!checkType && checkType.status === 404) {
    return checkType;
  }
  try {
    const result = await window.Store.WapQuery.queryExist(id);
    if (result.status === 404) {
      throw 404;
    }
    if (result.jid === undefined) {
      throw 404;
    }
    const data = window.WAPI._serializeNumberStatusObj(result);
    if (data.status == 200) {
      data.numberExists = true;
      data.profilePic = await WAPI.getProfilePicFromServer(id);
      return data;
    }
  } catch (error) {
    return window.WAPI._serializeNumberStatusObj({
      status: error,
      jid: new window.Store.WidFactory.createWid(id)
    });
  }
}
