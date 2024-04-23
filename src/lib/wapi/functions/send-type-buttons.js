export async function sendTypeButtons(to, text, title, footer, hButtons) {
  const chat = await WAPI.sendExist(to)

  if (typeof text != 'string' || text.length === 0) {
    return WAPI.scope(to, true, 404, 'It is necessary to write a text!')
  }

  let b = 0

  if (Array.isArray(hButtons) && hButtons.length > 0) {
    for (const index in hButtons) {
      if (typeof hButtons[index] !== 'function') {
        if (hButtons[index].urlButton) {
          b++
          if (!hButtons[index].urlButton) {
            return WAPI.scope(to, true, 404, 'passed object urlButton')
          }
          if (typeof hButtons[index].urlButton !== 'object') {
            return WAPI.scope(to, true, 404, 'passed object value in urlButton')
          }
          if (!hButtons[index].urlButton.displayText) {
            return WAPI.scope(to, true, 404, 'passed object displayText')
          }

          if (typeof hButtons[index].urlButton.displayText !== 'string') {
            return WAPI.scope(
              to,
              true,
              404,
              'passed string value in displayText'
            )
          }
          if (!hButtons[index].urlButton.url) {
            return WAPI.scope(to, true, 404, 'passed object url')
          }
          if (typeof hButtons[index].urlButton.url !== 'string') {
            return WAPI.scope(to, true, 404, 'passed string value in url')
          }
        }

        if (hButtons[index].callButton) {
          b++
          if (!hButtons[index].callButton) {
            return WAPI.scope(to, true, 404, 'passed object callButton')
          }
          if (typeof hButtons[index].callButton !== 'object') {
            return WAPI.scope(
              to,
              true,
              404,
              'passed object value in callButton'
            )
          }
          if (!hButtons[index].callButton.displayText) {
            return WAPI.scope(to, true, 404, 'passed object displayText')
          }
          if (typeof hButtons[index].callButton.displayText !== 'string') {
            return WAPI.scope(
              to,
              true,
              404,
              'passed string value in displayText'
            )
          }
          if (!hButtons[index].callButton.phoneNumber) {
            return WAPI.scope(to, true, 404, 'passed object phoneNumber')
          }
          if (typeof hButtons[index].callButton.phoneNumber !== 'string') {
            return WAPI.scope(
              to,
              true,
              404,
              'passed string value in phoneNumber'
            )
          }
        }

        if (hButtons[index].quickReplyButton) {
          b++
          if (!hButtons[index].quickReplyButton) {
            return WAPI.scope(to, true, 404, 'passed object quickReplyButton')
          }
          if (typeof hButtons[index].quickReplyButton !== 'object') {
            return WAPI.scope(
              to,
              true,
              404,
              'passed object value in quickReplyButton'
            )
          }
          if (!hButtons[index].quickReplyButton.displayText) {
            return WAPI.scope(to, true, 404, 'passed object displayText')
          }
          if (
            typeof hButtons[index].quickReplyButton.displayText !== 'string'
          ) {
            return WAPI.scope(
              to,
              true,
              404,
              'passed string value in displayText'
            )
          }
          if (!hButtons[index].quickReplyButton.id) {
            hButtons[index].quickReplyButton.id = `id${index}`
          }
        }
      }
    }
  }

  if (b === 0) {
    return WAPI.scope(to, true, 404, 'button type not specified!')
  }
  if (chat && chat.status != 404 && chat.id) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized)
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
    const buttons = new Store.TemplateButtonCollection()
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
      isFromTemplate: true,
      footer: footer,
      body: text,
      buttons,
      __x_title: title,
      hydratedButtons: hButtons,
    }

    message.buttons.add(
      message.hydratedButtons.map((e, t) => {
        const r = `${null != e.index ? e.index : t}`
        if (e.quickReplyButton) {
          return new Store.templateButton({
            id: r,
            displayText: e.quickReplyButton.displayText,
            selectionId: e.quickReplyButton.id,
            subtype: 'quick_reply',
          })
        }
        if (e.urlButton) {
          return new Store.templateButton({
            id: r,
            displayText: e.urlButton.displayText,
            url: e.urlButton?.url,
            subtype: 'url',
          })
        }
        if (e.callButton) {
          return new Store.templateButton({
            id: r,
            displayText: e.callButton.displayText,
            phoneNumber: e.callButton.phoneNumber,
            subtype: 'call',
          })
        }
      })
    )

    var result = (
      await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
    )[1]
    if (
      result === 'success' ||
      result === 'OK' ||
      result.messageSendResult === 'OK'
    ) {
      return WAPI.scope(newMsgId, false, result, null)
    } else {
      return WAPI.scope(newMsgId, true, result, null)
    }
  } else {
    return chat
  }
}
