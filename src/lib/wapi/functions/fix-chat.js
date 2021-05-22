export async function pinChat(chatId, type = true, notExist = false) {
  if (typeof type != 'boolean' || typeof notExist != 'boolean') {
    var text = 'incorrect parameter, insert a boolean true or false';
    return WAPI.scope(chatId, true, null, text);
  }
  let typeFix = type ? 'pin' : 'unpin',
    retult = void 0;
  var chat = await WAPI.sendExist(chatId, true, notExist);
  if (!chat.erro) {
    var m = {
        type: 'pinChat',
        typefix: typeFix,
      },
      To = await WAPI.getchatId(chat.id);
    await Store.pinChat
      .setPin(chat, type)
      .then((_) => {
        var obj = WAPI.scope(To, false, 'OK', null);
        Object.assign(obj, m);
        retult = obj;
      })
      .catch((error) => {
        var obj = WAPI.scope(To, true, error, 'Pin Chat first');
        Object.assign(obj, m);
        retult = obj;
      });
    return retult;
  } else {
    return chat;
  }
}
