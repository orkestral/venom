export async function setNewMessageId(info, checkNumber = true) {
  if (
    info &&
    typeof info === 'object' &&
    info.number &&
    info._serialized &&
    info.id
  ) {
    const chat = checkNumber
      ? await WAPI.sendExist(info.number)
      : await WAPI.returnChat(info.number);
    delete info.number;
    if (chat.id) {
      const newMsgId = new Object();
      newMsgId.fromMe = true;
      newMsgId.id = info.id;
      newMsgId.remote = await new Store.WidFactory.createWid(
        chat.id._serialized
      );
      newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`;
      const Msgkey = await new Store.MsgKey(newMsgId);
      return Msgkey;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
