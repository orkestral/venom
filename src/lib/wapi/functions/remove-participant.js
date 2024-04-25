const { GROUP_ERRORS } = require('../types/group-errors')

export async function removeParticipant(groupId, contactsId) {
  const chat = Store.Chat.get(groupId)

  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId]
  }

  contactsId = contactsId.filter(
    (item, index) => contactsId.indexOf(item) === index
  )

  const result = {}
  contactsId.forEach((contactId) => {
    result[contactId] = { success: false }
  })

  contactsId = await Promise.all(
    contactsId.map(async (contactId) => {
      const contactObj = await WAPI.sendExist(contactId, true, false)
      if (
        !contactObj ||
        contactObj.erro ||
        contactObj.status === 404 ||
        !contactObj.isUser
      ) {
        result[contactId].error = GROUP_ERRORS.INVALID_CONTACT_ID
        return
      }
      return contactObj
    })
  )
  contactsId = contactsId.filter((el) => el)

  contactsId = contactsId
    .map((c) => {
      const participant = chat.groupMetadata.participants.get(c.id)
      if (!participant) {
        result[c.id].error = GROUP_ERRORS.CONTACT_NOT_IN_GROUP
        return
      }
      return participant
    })
    .filter((el) => el)
  /* .map((c) => c.id)
  await window.Store.WapQuery.removeParticipants(chat.id, contactsId)
  const participants = contactsId.map((c) =>
    chat.groupMetadata.participants.get(c)
  ) */

  if (Object.keys(result).every((key) => result[key].error)) {
    return result
  }

  try {
    await window.Store.Participants.removeParticipants(chat, contactsId)
    contactsId.forEach((c) => {
      result[c.id].success = true
    })
  } catch (err) {
    console.log(err)
  }

  return result
}
