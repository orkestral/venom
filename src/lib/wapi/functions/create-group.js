const { GROUP_ERRORS } = require('../constants/group-errors')
const { verifyContacts } = require('../validation/group')

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
    const index = contacts.findIndex(
      (contact) => contact.phoneNumber === phoneNumber
    )
    const statusError = parseInt(participant.error)
    if (!statusError) {
      return (contacts[index].success = true)
    }
    switch (statusError) {
      case 401:
        contacts[index].error = GROUP_ERRORS.CONTACT_BLOCKED_ME
        break
      case 403:
        contacts[index].error = GROUP_ERRORS.FORBIDDEN
        break
      case 404:
        contacts[index].error = GROUP_ERRORS.INVALID_CONTACT_ID
        break
      case 408:
        contacts[index].error = GROUP_ERRORS.RECENT_LEAVE
        break
      case 409:
        contacts[index].error = GROUP_ERRORS.CONTACT_ALREADY_IN_GROUP
        break
      default:
        contacts[index].error = GROUP_ERRORS.FORBIDDEN
    }
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
