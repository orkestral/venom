export async function checkNumberStatus(id, conn = true) {
  try {
    const err = { error: 404 };
    const checkType = WAPI.sendCheckType(id);
    if (!!checkType && checkType.status === 404) {
      Object.assign(err, { text: checkType.text });
      throw err;
    }
    if (conn === true) {
      const connection = window.Store.State.default.state;
      if (connection !== 'CONNECTED') {
        Object.assign(err, {
          text: 'No connection with WhatsApp',
          connection: connection
        });
        throw err;
      }
    }
    const result = await Store.WidFactory.createWid(id);
    if (result.status === 404) {
      throw err;
    }
    if (result.jid === undefined) {
      throw err;
    }
    const data = window.WAPI._serializeNumberStatusObj(result);
    if (data.status == 200) {
      data.numberExists = true;
      data.profilePic = await WAPI.getProfilePicFromServer(id);
      return data;
    }
  } catch (e) {
    return window.WAPI._serializeNumberStatusObj({
      status: e.error,
      text: e.text,
      connection: e.connection,
      jid: e.text ? undefined : new window.Store.WidFactory.createWid(id)
    });
  }
}
