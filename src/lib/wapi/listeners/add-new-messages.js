export function addNewMessagesListener() {
  window.WAPI.waitNewMessages = waitNewMessages;
}

/**
 * Registers a callback to be called when a new message arrives the WAPI.
 * @param rmCallbackAfterUse - Boolean - Specify if the callback need to be executed only once
 * @param done - function - Callback function to be called when a new message arrives.
 * @returns {boolean}
 */
function waitNewMessages(rmCallbackAfterUse = true, done) {
  window.WAPI._newMessagesCallbacks.push({
    callback: (e) => {
      done(e);
    },
    rmAfterUse: rmCallbackAfterUse,
  });
  return true;
}
