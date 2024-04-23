import { processFiles } from './process-files'
import { base64ToFile } from '../helper'

export async function sendFile(
  file,
  chatid,
  filename,
  caption,
  type,
  status,
  passId,
  checkNumber = true,
  forcingReturn = false,
  delSend = true
) {
  type = type ? type : 'sendFile'

  if (typeof chatid != 'string' || chatid.length === 0) {
    return WAPI.scope(
      chatid,
      true,
      null,
      'incorrect parameter chatid, insert an string.'
    )
  }

  if (typeof filename !== 'string' || chatid.length === 0) {
    return WAPI.scope(
      chatid,
      true,
      null,
      'incorrect parameter filename, insert an string'
    )
  }

  if (typeof caption !== 'string' || chatid.length === 0) {
    return WAPI.scope(
      chatid,
      true,
      null,
      'incorrect parameter caption, insert an string'
    )
  }

  if (typeof file !== 'string' || chatid.length === 0) {
    return WAPI.scope(
      chatid,
      true,
      null,
      'incorrect parameter file, insert an string'
    )
  }

  var mime = file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  if (mime && mime.length) {
    mime = mime[1]
  }

  const chat = checkNumber
    ? await WAPI.sendExist(chatid)
    : await WAPI.returnChat(chatid)

  if (chat && chat.status != 404 && chat.id) {
    const inChat = await WAPI.getchatId(chat.id).catch(() => {
      return WAPI.scope(chat.id, true, 404, 'Error to number ' + chatid)
    })

    if (inChat) {
      chat.lastReceivedKey && chat.lastReceivedKey._serialized
        ? (chat.lastReceivedKey._serialized = inChat._serialized)
        : ''
      chat.lastReceivedKey && chat.lastReceivedKey.id
        ? (chat.lastReceivedKey.id = inChat.id)
        : ''
    }

    const m = { type: type, filename: filename, text: caption, mimeType: mime }
    const newMsgId = !passId
      ? await window.WAPI.getNewMessageId(chat.id._serialized, checkNumber)
      : await window.WAPI.setNewMessageId(passId, checkNumber)

    if (!newMsgId) {
      return WAPI.scope(chat.id, true, 404, 'Error to newId')
    }
    const chatWid = new Store.WidFactory.createWid(chatid)
    await Store.Chat.add(
      {
        createdLocally: true,
        id: chatWid,
      },
      {
        merge: true,
      }
    )
    const result = await Store.Chat.find(chat.id)
      .then(async (_chat) => {
        const mediaBlob = base64ToFile(file, filename || 'file')
        return await processFiles(_chat, mediaBlob)
          .then(async (mc) => {
            if (typeof mc === 'object' && mc._models && mc._models[0]) {
              const media = mc._models[0]
              const enc = await WAPI.encryptAndUploadFile(media.type, mediaBlob)

              if (enc === false) {
                return WAPI.scope(
                  chat.id,
                  true,
                  404,
                  'Error to encryptAndUploadFile'
                )
              }

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
                invis: true,
                type: media.type,
                deprecatedMms3Url: enc.url,
                directPath: enc.directPath,
                encFilehash: enc.encFilehash,
                filehash: enc.filehash,
                mediaKeyTimestamp: enc.mediaKeyTimestamp,
                mimetype: media.mimetype,
                ephemeralStartTimestamp: enc.mediaKeyTimestamp,
                mediaKey: enc.mediaKey,
                size: media.filesize,
                caption: caption,
                filename: filename,
              }
              if (forcingReturn) {
                if (delSend) {
                  while (true) {
                    const connection = window.Store.State.Socket.state
                    if (connection === 'CONNECTED') {
                      const result = await window.Store.addAndSendMsgToChat(
                        chat,
                        message
                      )

                      await WAPI.sleep(5000)
                      const statusMsg = chat.msgs._models.filter(
                        (e) => e.id === newMsgId._serialized && e.ack > 0
                      )
                      if (statusMsg.length === 0) {
                        await WAPI.deleteMessages(chatid, [
                          newMsgId._serialized,
                        ])
                      } else {
                        const obj = WAPI.scope(
                          newMsgId,
                          false,
                          WAPI._serializeForcing(result),
                          null
                        )
                        Object.assign(obj, m)

                        return obj
                      }
                    }
                  }
                } else {
                  const result = await window.Store.addAndSendMsgToChat(
                    chat,
                    message
                  )

                  const obj = WAPI.scope(
                    newMsgId,
                    false,
                    WAPI._serializeForcing(result),
                    null
                  )
                  Object.assign(obj, m)
                  return obj
                }
              }
              try {
                return (
                  await Promise.all(
                    window.Store.addAndSendMsgToChat(chat, message)
                  )
                )[1]
              } catch (e) {
                return WAPI.scope(
                  chat.id,
                  true,
                  404,
                  'The message was not sent'
                )
              }
            } else {
              return WAPI.scope(chat.id, true, 404, 'Error to models')
            }
          })
          .catch(() => {
            return WAPI.scope(chat.id, true, 404, 'Error to processFiles')
          })
      })
      .catch(() => {
        return WAPI.scope(chat.id, true, 404, 'Error to chat not find')
      })

    if (result.erro === false) {
      return result
    }
    if (
      result === 'success' ||
      result === 'OK' ||
      result.messageSendResult === 'OK'
    ) {
      const obj = WAPI.scope(newMsgId, false, result, null)
      Object.assign(obj, m)
      return obj
    }

    if (result.erro === true) {
      return result
    }

    const obj = WAPI.scope(newMsgId, true, result, null)
    Object.assign(obj, m)
    return obj
  } else {
    if (!chat.erro) {
      chat.erro = true
    }
    return chat
  }
}
