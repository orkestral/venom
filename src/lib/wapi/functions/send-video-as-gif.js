import { processFiles } from './process-files';
import { base64ToFile } from '../helper';

/**
 * Sends video as a gif to given chat id
 * @param {string} dataBase64
 * @param {string} chatid
 * @param {string} filename
 * @param {string} caption
 * @param {Function} done Optional callback
 */
export async function sendVideoAsGif(
  dataBase64,
  chatid,
  filename,
  caption,
  done
) {
  // const idUser = new window.Store.UserConstructor(chatid);
  const idUser = new Store.WidFactory.createWid(chatid);
  await Store.Chat.add(
    {
      createdLocally: true,
      id: idUser
    },
    {
      merge: true
    }
  );
  return Store.Chat.find(idUser).then((chat) => {
    var mediaBlob = base64ToFile(dataBase64, filename);
    processFiles(chat, mediaBlob).then((mc) => {
      var media = mc.models[0];
      media.mediaPrep._mediaData.isGif = true;
      media.mediaPrep._mediaData.gifAttribution = 1;
      media.mediaPrep.sendToChat(chat, { caption: caption });
      if (done !== undefined) done(true);
    });
  });
}
