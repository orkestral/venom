import { processFiles } from './process-files';
import { base64ToFile } from '../helper';
import C from '../jssha';
/**
 * Sends files
 * @param {string} Base64 base64 encoded file
 * @param {string} chatid Chat id
 */
export async function sendPtt(
  Base64,
  chatid,
  passId,
  checkNumber = true,
  forcingReturn = false,
  delSend = true
) {
  if (typeof Base64 === 'string' && !Base64.length) {
    return WAPI.scope(chatid, true, 404, 'Audio not foud');
  }
  const chat = checkNumber
    ? await WAPI.sendExist(chatid)
    : await WAPI.returnChat(chatid);

  if (chat && chat.status != 404 && chat.id) {
    const m = { type: 'sendPtt' };

    let inChat = await WAPI.getchatId(chat.id).catch(() => {
      return WAPI.scope(chat.id, true, 404, 'Error to number ' + chatid);
    });

    if (inChat) {
      chat.lastReceivedKey && chat.lastReceivedKey._serialized
        ? (chat.lastReceivedKey._serialized = inChat._serialized)
        : '';
      chat.lastReceivedKey && chat.lastReceivedKey.id
        ? (chat.lastReceivedKey.id = inChat.id)
        : '';
    }

    const newMsgId = !passId
      ? await window.WAPI.getNewMessageId(chat.id._serialized, checkNumber)
      : await window.WAPI.setNewMessageId(passId, checkNumber);

    if (!newMsgId) {
      return WAPI.scope(chat.id, true, 404, 'Error to newId');
    }
    const chatWid = new Store.WidFactory.createWid(chatid);
    await Store.Chat.add(
      {
        createdLocally: true,
        id: chatWid
      },
      {
        merge: true
      }
    );
    let result = await Store.Chat.find(chat.id)
      .then(async (chat) => {
        const mediaBlob = base64ToFile(Base64);
        return await processFiles(chat, mediaBlob).then(async (mc) => {
          if (typeof mc === 'object' && mc._models && mc._models[0]) {
            const media = mc._models[0];
            const enc = await WAPI.encryptAndUploadFile('ptt', mediaBlob);

            if (enc === false) {
              return WAPI.scope(
                chat.id,
                true,
                404,
                'Error to encryptAndUploadFile'
              );
            }

            const fromwWid = await Store.MaybeMeUser.getMaybeMeUser();

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
              type: 'ptt', //media.type,
              duration: media?.__x_mediaPrep?._mediaData?.duration,
              deprecatedMms3Url: enc.url,
              directPath: enc.directPath,
              encFilehash: enc.encFilehash,
              filehash: enc.filehash,
              mediaKeyTimestamp: enc.mediaKeyTimestamp,
              mimetype: media.mimetype,
              ephemeralStartTimestamp: enc.mediaKeyTimestamp,
              mediaKey: enc.mediaKey,
              size: media.filesize
            };

            if (forcingReturn) {
              if (delSend) {
                while (true) {
                  const connection = window.Store.State.Socket.state;
                  if (connection === 'CONNECTED') {
                    const result = await window.Store.addAndSendMsgToChat(
                      chat,
                      message
                    );
                    await WAPI.sleep(5000);
                    const statusMsg = chat.msgs._models.filter(
                      (e) => e.id === newMsgId._serialized && e.ack > 0
                    );
                    if (statusMsg.length === 0) {
                      await WAPI.deleteMessages(chatid, [newMsgId._serialized]);
                    } else {
                      let obj = WAPI.scope(
                        newMsgId,
                        false,
                        WAPI._serializeForcing(result),
                        null
                      );
                      Object.assign(obj, m);
                      return obj;
                    }
                  }
                }
              } else {
                const result = await window.Store.addAndSendMsgToChat(
                  chat,
                  message
                );
                let obj = WAPI.scope(
                  newMsgId,
                  false,
                  WAPI._serializeForcing(result),
                  null
                );
                Object.assign(obj, m);
                return obj;
              }
            }

            try {
              return (
                await Promise.all(
                  window.Store.addAndSendMsgToChat(chat, message)
                )
              )[1];
            } catch (e) {
              return WAPI.scope(chat.id, true, 404, 'The message was not sent');
            }
          } else {
            return WAPI.scope(chat.id, true, 404, 'Error to models');
          }
        });
      })
      .catch((e) => {
        return WAPI.scope(chat.id, true, 404, 'Error to chat not find');
      });

    if (result.erro === false) {
      return result;
    }

    if (result === 'success' || result === 'OK') {
      let obj = WAPI.scope(newMsgId, false, result, null);
      Object.assign(obj, m);
      return obj;
    }

    if (result.erro === true) {
      return result;
    }

    let obj = WAPI.scope(newMsgId, true, result, null);
    Object.assign(obj, m);
    return obj;
  } else {
    if (!chat.erro) {
      chat.erro = true;
    }
    return chat;
  }
}
