export async function loadAllEarlierMessages(id, chat) {
  const found = WAPI.getChat(id);
  while (!found.msgs.msgLoadState.noEarlierMsgs) {
    await found.onEmptyMRM();
    await WAPI.sleep(100);
  }
  chat(found);
  return true;
}

/**
 * SYNC version
 * Loads all earlier messages of given chat id
 * @param {string} id Chat id
 * @param {Funciton} done Optional callback
 */
export function asyncLoadAllEarlierMessages(id, done) {
  loadAllEarlierMessages(id);
  done();
}
