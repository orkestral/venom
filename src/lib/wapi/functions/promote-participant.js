export async function promoteParticipant(groupId, contactsId, done) {
  const chat = Store.Chat.get(groupId);

  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  contactsId = await Promise.all(contactsId.map((c) => WAPI.sendExist(c)));
  contactsId = contactsId
    .filter((c) => !c.erro && c.isUser)
    .map((c) => chat.groupMetadata.participants.get(c.id))
    .filter((c) => typeof c !== 'undefined')
    .map((c) => c.id);

  if (!contactsId.length) {
    typeof done === 'function' && done(false);
    return false;
  }

  await window.Store.WapQuery.promoteParticipants(chat.id, contactsId);

  const participants = contactsId.map((c) =>
    chat.groupMetadata.participants.get(c)
  );

  await window.Store.Participants.promoteParticipants(chat, participants);

  typeof done === 'function' && done(true);
  return true;
}
