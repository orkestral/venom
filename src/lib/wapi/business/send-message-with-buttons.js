window.WAPI.sendButtons = async function (chatId) {
  var chat = Store.Chat.get(chatId);
  var tempMsg = Object.create(chat.msgs.filter((msg) => msg.__x_isSentByMe)[0]);
  // var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.to._serialized===chatId&&msg.__x_isSentByMe&& msg.type=='chat' && !msg.quotedStanzaID)[0])
  var t2 = Object.create(
    Store.Msg.filter((x) => (x.type == 'template') & !x.id.fromMe)[0]
  );
  var newId = window.WAPI.getNewMessageId(chat.id._serialized);
  delete tempMsg.hasTemplateButtons;
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: chat.id,
    isNewMsg: false,
    // isNewMsg: !0,
    type: 'template',
    subtype: 'text',
    body: 'body text',
    isForwarded: false,
    broadcast: false,
    isQuotedMsgAvailable: false,
    shouldEnableHsm: true,
    __x_hasTemplateButtons: true,
    invis: true
  };

  Object.assign(tempMsg, extend);

  var btns = new Store.Builders.HydratedFourRowTemplate({
    hydratedButtons: [
      new Store.Builders.HydratedTemplateButton({
        quickReplyButton: new Store.Builders.HydratedQuickReplyButton({
          displayText: 'test',
          id: '{"eventName":"inform"}',
          quickReplyButton: true,
          subtype: 'quick_reply'
        }),
        index: 0
      }),
      new Store.Builders.HydratedTemplateButton({
        callButton: new Store.Builders.HydratedCallButton({
          displayText: 'test call',
          phoneNumber: '4477777777777'
        }),
        index: 1
      }),
      new Store.Builders.HydratedTemplateButton({
        urlButton: new Store.Builders.HydratedURLButton({
          displayText: 'test url',
          url: 'https://google.com'
        }),
        index: 2
      })
    ],
    hydratedContentText: 'hellllloooowww',
    hydratedFooterText: 'asdasd',
    hydratedTitleText: 'asdasd232'
  });

  Store.Parser.parseTemplateMessage(t2, btns);
  tempMsg.buttons = t2.buttons;
  console.log('t2', t2.body);
  tempMsg.mediaData = undefined;
  tempMsg.mediaObject = undefined;
  tempMsg._minEphemeralExpirationTimestamp();
  tempMsg.senderObj.isBusiness = true;
  tempMsg.senderObj.isEnterprise = true;
  tempMsg.senderObj = {
    ...tempMsg.senderObj,
    isBusiness: true,
    isEnterprise: true,
    notifyName: 'button test',
    mentionName: 'Button Test',
    displayName: 'Button Test',
    searchName: 'button test',
    header: 'b',
    formattedShortNameWithNonBreakingSpaces: 'Button test',
    formattedShortName: 'Button test',
    formattedName: 'Button test',
    formattedUser: 'Button test'
  };
  tempMsg.body = t2.body;
  tempMsg.to = tempMsg.from;
  tempMsg.caption = tempMsg.body;
  console.log('tempMsg', tempMsg);
  return chat.sendQueue
    .enqueue(
      chat.addQueue
        .enqueue(
          Store.MessageUtils.appendMessage(chat, tempMsg).then(() => {
            var e = Store.Msg.add(tempMsg)[0];
            console.log('e ', e);
            if (e) {
              return e.waitForPrep().then(() => {
                return e;
              });
            }
          })
        )
        .then((t) => chat.msgs.add(t))
        .catch((e) => console.log(e))
    )
    .then((t) => {
      var e = t[0];
      const s = Store.Base2;
      if (!s.BinaryProtocol)
        window.Store.Base2.BinaryProtocol = new window.Store.bp(11);
      var idUser = new Store.WidFactory.createWid(chatId);
      var k = Store.createMessageKey({
        ...e,
        to: idUser,
        id: e.__x_id
      });
      console.log('key', k);
      var wm = new Store.WebMessageInfo({
        message: new Store.Builders.Message({
          // conversation:'okhellowhi',
          templateMessage: new Store.Builders.TemplateMessage({
            hydratedFourRowTemplate: btns,
            hydratedTemplate: btns
          })
        }),
        key: k,
        messageTimestamp: e.t,
        multicast: undefined,
        url: undefined,
        urlNumber: undefined,
        clearMedia: undefined,
        ephemeralDuration: undefined
      });
      console.log('wm', wm);
      var action = s.actionNode('relay', [
        ['message', null, Store.WebMessageInfo.encode(wm).readBuffer()]
      ]);
      console.log('action', action);
      var a = e.id.id;
      return new Promise(function (resolve, reject) {
        console.log('yo');
        return s.binSend(
          'send',
          action,
          reject,
          {
            tag: a,
            onSend: s.wrap((_) => {
              console.log('onsend', _);
              resolve(_);
            }),
            onDrop: s.wrap((_) => {
              console.log('ondrop', _);
              reject(_);
            }),
            retryOn5xx: !0,
            resendGuard: function (_) {
              var t = Store.Msg.get(e.id);
              console.log('in resend', _);
              return 'protocol' === e.type || (t && t.id.equals(e.id));
            }
          },
          {
            debugString: ['action', 'message', e.type, e.subtype, a].join(),
            debugObj: {
              xml: action,
              pb: wm
            },
            metricName: 'MESSAGE',
            ackRequest: !1
          }
        );
      });
    });
};

window.WAPI.sendButtons2 = async function (chatId) {
  var chat = Store.Chat.get(chatId);
  var tempMsg = Object.create(
    Store.Msg.models.filter(
      (msg) =>
        msg.to._serialized === chatId &&
        msg.__x_isSentByMe &&
        msg.type == 'chat' &&
        !msg.quotedStanzaID
    )[0]
  );
  var t2 = Object.create(
    Store.Msg.models.filter(
      (msg) =>
        msg.to._serialized === chatId &&
        msg.__x_isSentByMe &&
        msg.type == 'chat' &&
        !msg.quotedStanzaID
    )[0]
  );
  var newId = window.WAPI.getNewMessageId(chatId);
  delete tempMsg.hasTemplateButtons;
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: Store.WidFactory.createWid(chatId),
    isNewMsg: !0,
    type: 'template',
    subtype: 'text',
    broadcast: false,
    isQuotedMsgAvailable: false,
    shouldEnableHsm: true,
    __x_hasTemplateButtons: true,
    invis: false
  };

  Object.assign(tempMsg, extend);

  var btns = new Store.Builders.HydratedFourRowTemplate({
    hydratedButtons: [
      new Store.Builders.HydratedTemplateButton({
        quickReplyButton: new Store.Builders.HydratedQuickReplyButton({
          displayText: 'test',
          id: '{"eventName":"inform"}',
          quickReplyButton: true
        }),
        index: 0
      }),
      new Store.Builders.HydratedTemplateButton({
        callButton: new Store.Builders.HydratedCallButton({
          displayText: 'test call',
          phoneNumber: '4477777777777'
        }),
        index: 1
      }),
      new Store.Builders.HydratedTemplateButton({
        callButton: new Store.Builders.HydratedCallButton({
          displayText: 'test call',
          phoneNumber: '4477777777777'
        }),
        index: 2
      }),
      new Store.Builders.HydratedTemplateButton({
        urlButton: new Store.Builders.HydratedURLButton({
          displayText: 'test url',
          url: 'https://google.com'
        }),
        index: 3
      })
    ],
    hydratedContentText: 'hellllloooowww',
    hydratedFooterText: 'asdasd',
    hydratedTitleText: 'asdasd232'
  });

  Store.Parser.parseTemplateMessage(t2, btns);
  tempMsg.buttons = t2.buttons;
  console.log('t2', t2.body);
  console.log('tempMsg', tempMsg);

  return chat.sendQueue
    .enqueue(
      chat.addQueue
        .enqueue(
          Store.MessageUtils.appendMessage(chat, tempMsg).then(() => {
            var e = Store.Msg.add(tempMsg)[0];
            console.log('e ', e);
            if (e) {
              return e.waitForPrep().then(() => {
                return e;
              });
            }
          })
        )
        .then((t) => chat.msgs.add(t))
        .catch((e) => console.log(e))
    )
    .then((t) => {
      var e = t[0];
      console.log('e', e);
      const s = Store.Base2;
      if (!s.BinaryProtocol)
        window.Store.Base2.BinaryProtocol = new window.Store.bp(11);
      var idUser = new Store.WidFactory.createWid(chatId);
      var k = Store.createMessageKey({
        ...e,
        to: idUser,
        id: e.__x_id
      });
      console.log('key', k);
      var wm = new Store.WebMessageInfo({
        message: new Store.Builders.Message({
          //if you uncomment the next line then the message gets sent properly as a text
          // conversation:'okhellowhi',
          templateMessage: new Store.Builders.TemplateMessage({
            hydratedFourRowTemplate: btns,
            hydratedTemplate: btns
          })
        }),
        key: k,
        messageTimestamp: e.t
      });
      console.log('wm', wm);
      var action = s.actionNode('relay', [
        ['message', null, Store.WebMessageInfo.encode(wm).readBuffer()]
      ]);
      console.log('action', action);
      var a = e.id.id;
      console.log('a', a);
      return new Promise(function (resolve, reject) {
        console.log('yo');
        return s.binSend(
          'send',
          action,
          reject,
          {
            tag: a,
            onSend: s.wrap(resolve),
            onDrop: s.wrap(reject),
            retryOn5xx: !0,
            resendGuard: function (_) {
              var t = Store.Msg.get(e.id);
              return 'protocol' === e.type || (t && t.id.equals(e.id));
            }
          },
          {
            debugString: ['action', 'message', 'chat', 'null', a].join(),
            debugObj: {
              xml: action,
              pb: wm
            },
            metricName: 'MESSAGE',
            ackRequest: !1
          }
        );
      });
    });
};
