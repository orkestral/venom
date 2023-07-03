export async function getGroupInviteLink(chatId) {
  var chat = Store.Chat.get(chatId);
  if (!chat.isGroup) return '';
  await Store.GroupInvite.queryGroupInviteCode(chat.groupMetadata);
  return {
    groupInviteLink: chat?.groupMetadata?.groupInviteLink,
    inviteCode: chat?.groupMetadata?.inviteCode,
    incognito: chat?.groupMetadata?.incognito,
    id: chat?.groupMetadata?.id
  };
}
