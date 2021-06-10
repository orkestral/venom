export async function setNewMessageId(info) {
  if (typeof info === 'object' && info.number && info._serialized && info.id) {
    const chat = await WAPI.sendExist(info.number);
    delete info.number;
    if (chat.id) {
      const newMsgId = new Object();
      newMsgId.fromMe = true;
      newMsgId.id = info.id;
      newMsgId.remote = await new Store.WidFactory.createWid(chat.id);
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
