export async function checkNumberStatus(id, conn = true) {
  try {
    const err = { error: 404 };
    const connection = window.Store.State.Socket.state;
    const checkType = WAPI.sendCheckType(id);
    if (!!checkType && checkType.status === 404) {
      Object.assign(err, {
        text: checkType.text,
        numberExists: null
      });
      throw err;
    }

    if (conn === true) {
      if (connection !== 'CONNECTED') {
        Object.assign(err, {
          text: 'No connection with WhatsApp',
          connection: connection,
          numberExists: null
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

    throw Object.assign(err, {
      connection: connection,
      numberExists: false,
      text: 'The number does not exist'
    });
  } catch (e) {
    return {
      status: e.error,
      text: e.text,
      numberExists: e.numberExists,
      connection: e.connection
    };
  }
}
