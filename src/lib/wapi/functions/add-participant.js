const { GROUP_ERRORS } = require('../constants/group-errors')
const { verifyContacts, verifyGroup } = require('../validation/group')

export async function addParticipant(groupId, contactsId) {
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId]
  }

  const chat = await WAPI.sendExist(groupId)

  const errorGroup = verifyGroup(chat, true)
  if (errorGroup) {
    return errorGroup
  }

  contactsId = contactsId.filter(
    (item, index) => contactsId.indexOf(item) === index
  )

  const contacts = await verifyContacts(contactsId, chat, false, true)

  if (contacts.every((contact) => contact.error)) {
    return contacts
  }

  const requestResult =
    await Store.GroupModifyParticipantsJob.addGroupParticipants(
      chat.id,
      contacts
        .filter((contact) => contact.id)
        .map((contact) => {
          return {
            phoneNumber: contact.id,
          }
        })
    )

  if (requestResult.status !== 207) {
    throw new Error(`Error in request: status [${requestResult.status}]`)
  }
  requestResult.participants.forEach((participant) => {
    const phoneNumber = participant.userWid._serialized
    const index = contacts.findIndex(
      (contact) => contact.phoneNumber === phoneNumber
    )
    const status = parseInt(participant.code)
    switch (status) {
      case 200:
        contacts[index].success = true
        break
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
  return contacts.map((contact) => {
    return {
      phoneNumber: contact.phoneNumber,
      success: contact.success,
      error: contact.error,
    }
  })
}
