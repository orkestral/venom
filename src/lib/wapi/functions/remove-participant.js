const { GROUP_ERRORS } = require('../constants/group-errors')
const { verifyContacts, verifyGroup } = require('../validation/group')

export async function removeParticipant(groupId, contactsId) {
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

  const contacts = await verifyContacts(contactsId, chat, true, false)

  if (contacts.every((contact) => contact.error)) {
    return contacts
  }

  const requestResult =
    await Store.GroupModifyParticipantsJob.removeGroupParticipants(
      chat.id,
      contacts.filter((contact) => contact.id).map((contact) => contact.id)
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
      case 404:
        contacts[index].error = GROUP_ERRORS.CONTACT_NOT_IN_GROUP
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
