export async function sendSticker(sticker, chatId, metadata, type) {
  var chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    var stick = new window.Store.Sticker.default.modelClass();

    stick.deprecatedMms3Url = sticker.clientUrl;
    stick.filehash = sticker.filehash;
    stick.id = sticker.filehash;
    stick.encFilehash = sticker.uploadhash;
    stick.mediaKey = sticker.mediaKey;
    stick.initialized = false;
    stick.mediaData.__x_mediaStage = 'INIT';
    stick.mimetype = 'image/webp';
    stick.height = metadata && metadata.height ? metadata.height : 512;
    stick.width = metadata && metadata.width ? metadata.width : 512;

    await stick.initialize();

    var result =
      (await stick.sendToChat(chat, {
        stickerIsFirstParty: false,
        stickerSendOrigin: 6,
      })) || '';
    var m = { type: type },
      obj,
      To = await WAPI.getchatId(chat.id);
    if (result === 'OK') {
      obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
