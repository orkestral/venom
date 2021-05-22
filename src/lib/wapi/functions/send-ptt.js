import { processFiles } from './process-files';
import { base64ToFile } from '../helper';

/**
 * Sends image to given chat if
 * @param {string} imgBase64 base64 encoded file
 * @param {string} chatid Chat id
 */
export async function sendPtt(imgBase64, chatid) {
  const chat = await WAPI.sendExist(chatid);
  if (chat && chat.status != 404) {
    let result = await Store.Chat.find(chatid).then(async (chat) => {
      var mediaBlob = base64ToFile(imgBase64);
      return await processFiles(chat, mediaBlob).then(async (mc) => {
        var media = mc.models[0];
        media.mediaPrep._mediaData.type = 'ptt';
        return await media.mediaPrep.sendToChat(chat, {});
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
