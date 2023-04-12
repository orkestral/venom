export async function revokeGroupInviteLink(chatId) {
  var chat = Store.Chat.get(chatId);
  if (!chat.isGroup) return false;
  await Store.GroupInvite.sendRevokeGroupInviteCode(chat.id);
  return true;
}
