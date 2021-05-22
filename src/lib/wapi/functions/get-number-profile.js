export async function getNumberProfile(id, done) {
  try {
    const result = await window.Store.WapQuery.queryExist(id);
    if (result.jid === undefined) throw 404;
    const data = window.WAPI._serializeNumberStatusObj(result);
    if (data.status == 200) data.numberExists = true;
    if (done !== undefined) {
      done(window.WAPI._serializeNumberStatusObj(result));
      done(data);
    }
    return data;
  } catch (e) {
    if (done !== undefined) {
      done(
        window.WAPI._serializeNumberStatusObj({
          status: e,
          jid: id,
        })
      );
    }
    return e;
  }
}
