export async function sendButtons(to, title, subtitle, buttons) {
  if (typeof title != 'string' || title.length === 0) {
    return WAPI.scope(to, true, 404, 'It is necessary to write a title!')
  }

  if (typeof subtitle != 'string' || subtitle.length === 0) {
    return WAPI.scope(to, true, 404, 'It is necessary to write a subtitle!')
  }

  if (Array.isArray(buttons) && buttons.length > 0) {
    for (const index in buttons) {
      if (typeof buttons[index] !== 'function') {
        if (!buttons[index].buttonText) {
          return WAPI.scope(to, true, 404, 'passed object buttonText')
        }
        if (typeof buttons[index].buttonText !== 'object') {
          return WAPI.scope(to, true, 404, 'passed object value in buttonText')
        }
        if (!buttons[index].buttonText.displayText) {
          return WAPI.scope(to, true, 404, 'passed object displayText')
        }
        if (typeof buttons[index].buttonText.displayText !== 'string') {
          return WAPI.scope(to, true, 404, 'passed string value in displayText')
        }
        if (!buttons[index].buttonId) {
          buttons[index].buttonId = `id${index}`
        }
        if (!buttons[index].type) {
          buttons[index].type = 1
        }
      }
    }
  }

  const chat = await WAPI.sendExist(to)

  if (chat && chat.status != 404 && chat.id) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized)
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()

    const message = {
      id: newMsgId,
      ack: 0,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      isNewMsg: !0,
      type: 'chat',
      body: title,
      caption: title,
      content: title,
      footer: subtitle,
      isDynamicReplyButtonsMsg: true,
      isForwarded: false,
      isFromTemplate: true,
      invis: true,
      fromMe: false,
    }
    var obj = {
      dynamicReplyButtons: buttons,
    }
    Object.assign(message, obj)
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
