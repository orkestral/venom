async function sendButtons(to = '557599951550@c.us') {
  const chat = await WAPI.sendExist(to);
  if (chat && chat.status != 404 && chat.id) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized);
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();
    const replyButtons = new Store.ButtonCollection();
    const buttons = new Store.TemplateButtonCollection();

    const message = {
      from: fromwWid,
      id: newMsgId,
      ack: 0,
      to: chat.id,
      local: !0,
      self: 'out',
      isNewMsg: !0,
      t: parseInt(new Date().getTime() / 1000),
      type: 'chat',
      isQuotedMsgAvailable: true,
      isFromTemplate: true, //
      //__x_hasTemplateButtons: true, //
      //__x_hasBodyOrFooter: true, //
      footer: 'test',
      body: 'Aceita nosso termo de uso',
      //__x_text: 'Aceita nosso termo de uso',
      buttons,
      caption: 'lol?',
      __x_title: 'Não Conhesse ainda?',
      //rowId: 1000000093,
      //isDynamicReplyButtonsMsg: true,

      //replyButtons,
      // dynamicReplyButtons: [
      //   {
      //     buttonId: 'id0',
      //     buttonText: {
      //       displayText: 'Text of Button 1',
      //     },
      //     type: 1,
      //   },
      // ],
      hydratedButtons: [
        // {
        //   index: 1,
        //   quickReplyButton: {
        //     displayText: 'sim',
        //     id: 'ID1',
        //   },
        // },
        // {
        //   index: 2,
        //   quickReplyButton: {
        //     displayText: 'não',
        //     id: 'ID2',
        //   },
        // },
        {
          $$unknownFieldCount: 0,
          urlButton: {
            $$unknownFieldCount: 0,
            displayText: `Veja esse site`,
            url: `https://www.youtube.com/watch?v=scTqpfL9WMA&list=RDscTqpfL9WMA&index=1`
          }
        }
        // {
        //   index: 4,
        //   callButton: {
        //     displayText: `lique para min`,
        //     phoneNumber: `+55 75 99951550`,
        //   },
        // },
      ]
    };

    message.buttons.add(
      message.hydratedButtons.map((e, t) => {
        const r = `${null != e.index ? e.index : t}`;
        if (e.quickReplyButton) {
          return new Store.templateButton({
            id: r,
            displayText: e.quickReplyButton.displayText,
            selectionId: e.quickReplyButton.id,
            subtype: 'quick_reply'
          });
        }
        if (e.urlButton) {
          return new Store.templateButton({
            $$unknownFieldCount: r,
            displayText: e.urlButton.displayText,
            url: e.urlButton?.url,
            subtype: 'url'
          });
        }
        if (e.callButton) {
          return new Store.templateButton({
            id: r,
            displayText: e.callButton.displayText,
            phoneNumber: e.callButton.phoneNumber,
            subtype: 'call'
          });
        }
      })
    );

    // message.replyButtons.add(
    //   message.dynamicReplyButtons.map(
    //     (b) =>
    //       new Store.replyButton({
    //         id: b.buttonId,
    //         displayText: b.buttonText?.displayText || undefined,
    //       })
    //   )
    // );

    // message.replyButtons.add(
    //   message.dynamicReplyButtons.map((e, t) => {
    //     var { buttonId: t, buttonText: n } = e;
    //     return new Store.templateButton({
    //       id: t,
    //       displayText: n.displayText,
    //     });
    //   })
    // );

    var f = await window.Store.addAndSendMsgToChat(chat, message);
    console.log(f);
  } else {
    return chat;
  }
}
