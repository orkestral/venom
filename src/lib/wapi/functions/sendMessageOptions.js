/**
 * Send message with options
 * @param {string} chatid the numberid xxx@c.us
 * @param {string} content the message
 * @param {string} options object aditionais
 */
export async function sendMessageOptions(chatId, content, options = {}) {
  const chat = Store.Chat.get(chatId)
  let attOptions = {}
  if (options.attachment) {
    attOptions = await WWebJS.processMediaData(
      options.attachment,
      options.sendAudioAsVoice
    )
    content = attOptions.preview
    delete options.attachment
  }

  let quotedMsgOptions = {}
  if (options.quotedMessageId) {
    const quotedMessage = await WAPI.getMessageById(
      options.quotedMessageId,
      null,
      false
    )
    if (quotedMessage && quotedMessage.canReply()) {
      quotedMsgOptions = quotedMessage.msgContextInfo(chat)
    }
    delete options.quotedMessageId
  }

  if (options.mentionedJidList) {
    options.mentionedJidList = options.mentionedJidList.map(
      (cId) => window.Store.Contact.get(cId).id
    )
  }

  let locationOptions = {}
  if (options.location) {
    locationOptions = {
      type: 'location',
      loc: options.location.description,
      lat: options.location.latitude,
      lng: options.location.longitude,
    }
    delete options.location
  }

  let vcardOptions = {}
  if (options.contactCard) {
    const contact = window.Store.Contact.get(options.contactCard)
    vcardOptions = {
      body: window.Store.VCard.vcardFromContactModel(contact).vcard,
      type: 'vcard',
      vcardFormattedName: contact.formattedName,
    }
    delete options.contactCard
  } else if (options.contactCardList) {
    const contacts = options.contactCardList.map((c) =>
      window.Store.Contact.get(c)
    )
    const vcards = contacts.map((c) =>
      window.Store.VCard.vcardFromContactModel(c)
    )
    vcardOptions = {
      type: 'multi_vcard',
      vcardList: vcards,
      body: undefined,
    }
    delete options.contactCardList
  } else if (
    options.parseVCards &&
    typeof content === 'string' &&
    content.startsWith('BEGIN:VCARD')
  ) {
    delete options.parseVCards
    try {
      const parsed = await window.Store.VCard.parseVcard(content)
      if (parsed) {
        vcardOptions = {
          type: 'vcard',
          vcardFormattedName: await window.Store.VCard.vcardGetNameFromParsed(
            parsed
          ),
        }
      }
    } catch (_) {
      // not a vcard
    }
  }

  if (options.linkPreview) {
    delete options.linkPreview
    const link = await window.Store.Validators.findLink(content)
    if (link) {
      const preview = await window.Store.Wap2.default.queryLinkPreview(link.url)
      preview.preview = true
      preview.subtype = 'url'
      options = { ...options, ...preview }
    }
  }
  const newMsgId = await window.WAPI.getNewMessageId(chat.id)
  const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
  const message = {
    ...options,
    id: newMsgId,
    ack: 0,
    body: content,
    from: fromwWid,
    to: chat.id,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    isNewMsg: !0,
    type: 'chat',
    ...locationOptions,
    ...attOptions,
    ...quotedMsgOptions,
    ...vcardOptions,
  }

  await window.Store.addAndSendMsgToChat(chat, message)

  return newMsgId._serialized
}
