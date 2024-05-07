const { GROUP_ERRORS } = require('../constants/group-errors')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

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
    // if you use sendExists with a valid contact id, but with @g.us instead of @c.us, it will return a valid contact
    // Therefore, we need to check if the contact is correctly typed
    if (contactId.contains('@g.us')) {
      return result.push({
        success: false,
        phoneNumber: contactId,
        error: GROUP_ERRORS.INVALID_CONTACT_ID,
      })
    }
    result.push({ success: false, phoneNumber: contactId })
  })

  await Promise.all(
    result.map(async (contact, index) => {
      if (contact.error) {
        return
      }
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

export const getAddParticipantStatusError = (statusError) => {
  switch (statusError) {
    case 401:
      return GROUP_ERRORS.CONTACT_BLOCKED_ME
    case 403:
      return GROUP_ERRORS.FORBIDDEN
    case 404:
      return GROUP_ERRORS.INVALID_CONTACT_ID
    case 408:
      return GROUP_ERRORS.RECENT_LEAVE
    case 409:
      return GROUP_ERRORS.CONTACT_ALREADY_IN_GROUP
    default:
      return GROUP_ERRORS.FORBIDDEN
  }
}

export const normalizePhoneNumber = (contactPhoneNumber) => {
  const phoneNumber = contactPhoneNumber.replace('@c.us', '')
  const phoneCountry = getCountryByPhoneNumber(phoneNumber)

  switch (phoneCountry) {
    case 'BR':
      if (hasThirteenDigits(phoneNumber)) {
        contactPhoneNumber = removeNineDigitInPhoneNumber(phoneNumber) + '@c.us'
      }
      break
  }

  return contactPhoneNumber
}

function removeNineDigitInPhoneNumber(phoneNumber) {
  return (
    phoneNumber.toString().substr(0, 4) + '' + phoneNumber.toString().substr(5)
  )
}

function hasThirteenDigits(phoneNumber) {
  return phoneNumber.toString().length === 13
}

function getCountryByPhoneNumber(phoneNumber) {
  const phone = getPhoneParse(phoneNumber)
  return phoneUtil.getRegionCodeForNumber(phone)
}

function getPhoneParse(phoneNumber) {
  return phoneUtil.parse(`+${phoneNumber}`)
}
