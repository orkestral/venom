import { processFiles } from './process-files';
import { base64ToFile } from '../helper';

/**
 * Sends files
 * @param {string} Base64 base64 encoded file
 * @param {string} chatid Chat id
 */
export async function sendPtt(Base64, chatid, passId) {
  const chat = await WAPI.sendExist(chatid);
  if (chat && chat.status != 404) {
    let result = await Store.Chat.find(chatid).then(async (chat) => {
      var mediaBlob = base64ToFile(Base64);
      return await processFiles(chat, mediaBlob).then(async (mc) => {
        const media = mc.models[0];
        const mediaData = media.__x_mediaPrep._mediaData;
        const enc = await WAPI.encryptAndUploadFile('ptt', mediaBlob);
        const newMsgId = !passId
          ? await window.WAPI.getNewMessageId(chat.id)
          : await window.WAPI.setNewMessageId(passId);
        const fromwWid = await window.Store.Conn.wid;

        const blobConst = new Store.blob.default.prototype.constructor();
        blobConst._blob = mediaData.mediaBlob;
        blobConst._mimetype = media.mimetype;
        blobConst._url = media.fullPreview;
        const data = {
          duration: mediaData.duration,
          filehash: mediaData.filehash,
          mediaStage: mediaData.mediaStage,
          mimetype: mediaData.mimetype,
          size: mediaBlob.size,
          type: 'ptt', //media.type,
          renderableUrl: media.fullPreview,
          mediaBlob: blobConst,
        };
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
          deprecatedMms3Url: enc.url,
          directPath: enc.directPath,
          duration: mediaData.duration,
          encFilehash: enc.encFilehash,
          filehash: enc.filehash,
          size: mediaBlob.size,
          mediaData: data,
          mediaKeyTimestamp: enc.mediaKeyTimestamp,
          mimetype: media.mimetype,
          ephemeralStartTimestamp: enc.mediaKeyTimestamp,
          mediaKey: enc.mediaKey,
        };

        return (
          await Promise.all(window.Store.addAndSendMsgToChat(chat, message))
        )[1];
      });
    });
    const m = { type: 'sendPtt' };
    let To = await WAPI.getchatId(chat.id);
    if (result === 'success' || result === 'OK') {
      let obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      let obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
