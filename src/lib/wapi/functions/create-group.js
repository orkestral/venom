export async function createGroup(name, contactsId) {
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  contactsId = await Promise.all(contactsId.map((c) => WAPI.sendExist(c)));
  contactsId = contactsId.filter((c) => !c.erro && c.isUser);

  if (!contactsId.length) {
    return false;
  }
  return await window.Store.createGroup(name, undefined, undefined, contactsId);
}
