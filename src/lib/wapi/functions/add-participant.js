export async function addParticipant(groupId, contactsId) {
  const chat = Store.Chat.get(groupId);

  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  contactsId = await Promise.all(contactsId.map((c) => WAPI.sendExist(c)));
  contactsId = contactsId.filter((c) => !c.erro && c.isUser).map((c) => c.id);

  if (!contactsId.length) {
    return false;
  }

  await window.Store.WapQuery.addParticipants(chat.id, contactsId);

  const participants = contactsId.map((c) =>
    chat.groupMetadata.participants.get(c)
  );

  await window.Store.Participants.addParticipants(chat, contactsId);

  return true;
}
