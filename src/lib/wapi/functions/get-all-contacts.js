export const getAllContacts = function () {
  const allContacts = Store.Contact.map((contact) =>
    WAPI._serializeContactObj(contact)
  )

  return allContacts.filter((result) => {
    return result.isUser === true
  })
}
