export function addOnPoll() {
  window.WAPI.onPoll = function (callback) {
    Store.PollVote.on('change', (e) => {
      callback(e);
    });
    return true;
  };
}
