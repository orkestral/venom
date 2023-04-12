export async function getGroupInviteLink(chatId) {
  var chat = Store.Chat.get(chatId);
  if (!chat.isGroup) return '';
  const code = await Store.GroupInvite.sendQueryGroupInviteCode(chat.id);
  return `https://chat.whatsapp.com/${code}`;
}
