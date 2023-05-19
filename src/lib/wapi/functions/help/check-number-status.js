export async function checkNumberStatus(id, conn = false) {
  try {
    const err = {
      error: 404
    };

    const connection =
      Store && Store.State && Store.State.Socket && Store.State.Socket.state
        ? Store.State.Socket.state
        : '';

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

    const lid = await WAPI.getChat(id);
    if (lid) {
      return await Store.checkNumberMD
        .queryExists(lid.id)
        .then((result) => {
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
            text: `The number does not exist`
          });
        })
        .catch((err) => {
          if (err.text) {
            throw err;
          }
          throw Object.assign(err, {
            connection: connection,
            numberExists: false,
            text: err
          });
        });
    } else {
      throw Object.assign(err, {
        connection: connection,
        numberExists: false
      });
    }
  } catch (e) {
    return {
      status: e.error,
      text: e.text,
      numberExists: e.numberExists,
      connection: e.connection
    };
  }
}
