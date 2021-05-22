import { processFiles } from './process-files';
import { base64ToFile } from '../helper';

export async function sendFile(
  imgBase64,
  chatid,
  filename,
  caption,
  type,
  status
) {
  type = type ? type : 'sendFile';

  if (
    (typeof filename != 'string' && filename != null) ||
    (typeof caption != 'string' && caption != null)
  ) {
    var text = 'incorrect parameter, insert an string.';
    return WAPI.scope(chatid, true, null, text);
  }
  var mime = imgBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    mime = mime[1];
  }
  var chat = await WAPI.sendExist(chatid);
  if (!chat.erro) {
    var mediaBlob = base64ToFile(imgBase64, filename),
      mediaCollection = await processFiles(chat, mediaBlob),
      media = mediaCollection.models[0];
    var result = (await media.sendToChat(chat, { caption: caption })) || '';
    var m = { type: type, filename: filename, text: caption, mimeType: mime };
    const chatTo = await WAPI.getchatId(chat.id);
    const To =
      status == false
        ? chatTo
        : { id: chatTo.id, _serialized: chatTo._serialized };
    if (result === 'success' || result === 'OK') {
      var obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      var obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
