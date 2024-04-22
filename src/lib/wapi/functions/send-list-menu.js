/**
 * Send List menu
 * @param {string} to the numberid xxx@c.us
 * @param {string} title the titulo
 * @param {string} subtitle the subtitle
 * @param {string} description the description
 * @param {string} buttonText the name button
 * @param {array} menu List menu
 */
export async function sendListMenu(
  to,
  title,
  subTitle,
  description,
  buttonText,
  menu
) {
  if (!title && typeof title != 'string') {
    return WAPI.scope(null, true, 404, 'Enter the title variable as an string')
  }

  if (!subTitle && typeof subTitle != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'Enter the SubTitle variable as an string'
    )
  }

  if (!description && typeof description != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'Enter the description variable as an string'
    )
  }

  if (!buttonText && typeof buttonText != 'string') {
    return WAPI.scope(
      null,
      true,
      404,
      'Enter the buttonText variable as an string'
    )
  }

  if (!menu && Array.isArray(menu) === false) {
    return WAPI.scope(null, true, 404, 'Enter the menu variable as an array')
  }

  for (const index in menu) {
    if (index !== 'remove') {
      if (
        !!menu[index].title &&
        typeof menu[index].title === 'string' &&
        menu[index].title.length
      ) {
        if (
          !!menu[index].rows &&
          Array.isArray(menu[index].rows) &&
          menu[index].rows.length
        ) {
          for (const i in menu[index].rows) {
            if (i !== 'remove') {
              if (
                !!menu[index].rows[i].title &&
                menu[index].rows[i].title.length
              ) {
                if (
                  !!menu[index].rows[i].description &&
                  menu[index].rows[i].description.length
                ) {
                  if (!menu[index].rows[i].rowId) {
                    menu[index].rows[i].rowId = `dessert_${i}`
                  }
                }
              } else {
                return WAPI.scope(
                  null,
                  true,
                  404,
                  'Enter the Title variable as an string'
                )
              }
            }
          }
        } else {
          return WAPI.scope(null, true, 404, 'Rows must be an object array')
        }
      } else {
        return WAPI.scope(null, true, 404, 'Incorrect Title passed in menu')
      }
    }
  }

  const chat = await WAPI.sendExist(to)

  if (chat && chat.status != 404 && chat.id) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id._serialized)
    const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
    const inChat = await WAPI.getchatId(chat.id).catch(() => {})

    if (inChat) {
      chat.lastReceivedKey._serialized = inChat._serialized
      chat.lastReceivedKey.id = inChat.id
    }

    const message = {
      id: newMsgId,
      ack: 0,
      from: fromwWid,
      to: chat.id,
      local: !0,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      isNewMsg: !0,
      invis: true,
      footer: subTitle,
      notifyName: '',
      type: 'list',
      interactiveAnnotations: true,
      interactiveMessage: true,
      star: false,
      broadcast: false,
      fromMe: false,
      list: {
        title: title,
        description: description,
        buttonText: buttonText,
        listType: 1,
        sections: menu,
      },
    }

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
