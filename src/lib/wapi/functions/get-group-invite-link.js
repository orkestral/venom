export async function getGroupInviteLink(chatId) {
  var chat = Store.Chat.get(chatId);
  if (!chat.isGroup) return '';
  await Store.GroupInvite.queryGroupInviteCode(chat);
  return `https://chat.whatsapp.com/${chat.inviteCode}`;
}
