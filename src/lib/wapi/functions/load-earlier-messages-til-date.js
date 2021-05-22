export function loadEarlierMessagesTillDate(id, lastMessage, done) {
  const found = WAPI.getChat(id);
  const x = function () {
    if (
      found.msgs.models[0].t > lastMessage &&
      !found.msgs.msgLoadState.noEarlierMsgs
    ) {
      found.loadEarlierMsgs().then(x);
    } else {
      done();
    }
  };
  x();
}
