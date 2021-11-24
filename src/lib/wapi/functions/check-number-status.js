export async function checkNumberStatus(id, conn = true) {
  try {
    const err = { error: 404 };
    const checkType = WAPI.sendCheckType(id);
    if (!!checkType && checkType.status === 404) {
      Object.assign(err, { text: checkType.text });
      throw err;
    }

    if (conn === true) {
      const connection = window.Store.State.Socket.state;
      if (connection !== 'CONNECTED') {
        Object.assign(err, {
          text: 'No connection with WhatsApp',
          connection: connection
        });
        throw err;
      }
    }

    const result = await Store.checkNumber(id);
    if (!!result && typeof result === 'object') {
      const data = {
        status: 200,
        numberExists: true,
        id: result.wid
      };
      return data;
    }

    throw err;
  } catch (e) {
    return {
      status: e.error,
      text: e.text
    };
  }
}
