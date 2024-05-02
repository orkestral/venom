enum ExposedFn {
  OnMessage = 'onMessage',
  OnAck = 'onAck',
  OnParticipantsChanged = 'onParticipantsChanged'
}

/**
 * Exposes [OnMessage] function
 */
(window as any).WAPI.waitNewMessages(false, (data: any[]) => {
  data.forEach((message: any) => {
    window[ExposedFn.OnMessage](message);
  });
});

// This does not appear to be implemented anywhere right now and is breaking code injection via evaluate instead of addScriptTag
/*
(window as any).WAPI.waitNewAcknowledgements(function (data: any) {
  if (window[ExposedFn.OnAck]) {
    window[ExposedFn.OnAck](data);
  }
});
*/
