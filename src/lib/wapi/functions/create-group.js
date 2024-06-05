const {
  getAddParticipantStatusError,
  verifyContacts,
  getContactIndex,
} = require('../validation/group')

export async function createGroup(name, contactsId, temporarySeconds) {
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId]
  }

  temporarySeconds = parseInt(temporarySeconds) || 0
  temporarySeconds = temporarySeconds < 0 ? 0 : temporarySeconds

  contactsId = contactsId.filter(
    (item, index) => contactsId.indexOf(item) === index
  )

  const contacts = await verifyContacts(contactsId)

  if (contacts.every((contact) => contact.error)) {
    return contacts
  }

  // TODO - In some cases, this is not being loaded. We need to enhance the injection from libs,
  // maybe verify if is loaded before trying to use something from Store
  const requestResult = await Store.GroupCreateJob.createGroup(
    name,
    contacts.filter((contact) => contact.id).map((contact) => contact.id),
    temporarySeconds
  )

  const creator = requestResult.creator._serialized

  requestResult.participants.forEach((participant) => {
    const phoneNumber = participant.wid._serialized
    if (creator === phoneNumber) {
      return
    }

    const index = getContactIndex(phoneNumber, contacts)

    const statusError = parseInt(participant.error)
    if (!statusError) {
      return (contacts[index].success = true)
    }
    contacts[index].error = getAddParticipantStatusError(statusError)
  })

  return {
    id: requestResult.wid._serialized,
    contacts: contacts.map((contact) => {
      return {
        phoneNumber: contact.phoneNumber,
        success: contact.success,
        error: contact.error,
      }
    }),
  }
}
