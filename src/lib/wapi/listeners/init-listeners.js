export function initNewMessagesListener() {
  window.WAPI.waitForStore(['Chat', 'Msg'], () => {
    window.WAPI._newMessagesListener = window.Store.Msg.on(
      'add',
      async (newMessage) => {
        if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe) {
          let message = await window.WAPI.processMessageObj(
            newMessage,
            false,
            false
          );
          if (message) {
            window.WAPI._newMessagesQueue.push(message);
            window.WAPI._newMessagesBuffer.push(message);
          }

          // Starts debouncer time to don't call a callback for each message if more than one message arrives
          // in the same second
          if (
            !window.WAPI._newMessagesDebouncer &&
            window.WAPI._newMessagesQueue.length > 0
          ) {
            window.WAPI._newMessagesDebouncer = setTimeout(() => {
              let queuedMessages = window.WAPI._newMessagesQueue;

              window.WAPI._newMessagesDebouncer = null;
              window.WAPI._newMessagesQueue = [];

              let removeCallbacks = [];

              window.WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
                if (callbackObj.callback !== undefined) {
                  callbackObj.callback(queuedMessages);
                }
                if (callbackObj.rmAfterUse === true) {
                  removeCallbacks.push(callbackObj);
                }
              });

              // Remove removable callbacks.
              removeCallbacks.forEach(function (rmCallbackObj) {
                let callbackIndex =
                  window.WAPI._newMessagesCallbacks.indexOf(rmCallbackObj);
                window.WAPI._newMessagesCallbacks.splice(callbackIndex, 1);
              });
            }, 1000);
          }
        }
      }
    );
  });

  window.WAPI._unloadInform = (event) => {
    // Save in the buffer the ungot unreaded messages
    window.WAPI._newMessagesBuffer.forEach((message) => {
      Object.keys(message).forEach((key) =>
        message[key] === undefined ? delete message[key] : ''
      );
    });

    sessionStorage.setItem(
      'saved_msgs',
      JSON.stringify(window.WAPI._newMessagesBuffer)
    );

    // Inform callbacks that the page will be reloaded.
    window.WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
      if (callbackObj.callback !== undefined) {
        callbackObj.callback({
          status: -1,
          message: 'page will be reloaded, wait and register callback again.'
        });
      }
    });
  };
}
