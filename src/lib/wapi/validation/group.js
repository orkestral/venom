const { GROUP_ERRORS } = require('../constants/group-errors')

export function verifyGroup(chat, needsToBeAdmin = false) {
  if (!chat || chat.erro || chat.status === 404 || !chat.isGroup) {
    return { error: GROUP_ERRORS.INVALID_GROUP_ID }
  }

  if (needsToBeAdmin) {
    if (!chat.iAmAdmin()) {
      return { error: GROUP_ERRORS.NOT_GROUP_ADMIN }
    }
  }

  return
}

export async function verifyContacts(
  contactsId,
  chat,
  needsToBeInGroup = false,
  needsToNotBeInGroup = false
) {
  contactsId = contactsId.filter(
    (item, index) => contactsId.indexOf(item) === index
  )

  const result = []
  contactsId.forEach((contactId) => {
    result.push({ success: false, phoneNumber: contactId })
  })

  await Promise.all(
    result.map(async (contact, index) => {
      const contactObj = await WAPI.sendExist(contact.phoneNumber, true, false)
      if (
        !contactObj ||
        contactObj.erro ||
        contactObj.status === 404 ||
        !contactObj.isUser
      ) {
        result[index].error = GROUP_ERRORS.INVALID_CONTACT_ID
        return
      }
      result[index].id = contactObj.id
    })
  )

  if (needsToBeInGroup || needsToNotBeInGroup) {
    result.forEach((contact) => {
      const participant = chat.groupMetadata.participants.get(contact.id)
      if (needsToBeInGroup && !participant) {
        contact.error = GROUP_ERRORS.CONTACT_NOT_IN_GROUP
        delete contact.id
      }
      if (needsToNotBeInGroup && participant) {
        contact.error = GROUP_ERRORS.CONTACT_ALREADY_IN_GROUP
        delete contact.id
      }
    })
  }

  return result
}
