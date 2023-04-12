export async function addParticipant(groupId, contactsId) {
  const chat = Store.Chat.get(groupId);

  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  contactsId = await Promise.all(contactsId.map((c) => WAPI.sendExist(c)));
  if (!contactsId.length) {
    return false;
  }

  try {
    await window.Store.Participants.addParticipants(chat, contactsId);
    return true;
  } catch {
    return false;
  }
}
