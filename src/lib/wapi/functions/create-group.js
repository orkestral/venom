export async function createGroup(name, contactsId) {
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  contactsId = await Promise.all(contactsId.map((c) => WAPI.sendExist(c)));
  contactsId = contactsId.filter((c) => !c.erro && c.isUser).map((c) => c.id);

  if (!contactsId.length) {
    return false;
  }
  return await window.Store.WapQuery.createGroup(name, contactsId);
}
