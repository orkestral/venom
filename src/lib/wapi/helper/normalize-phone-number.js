const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

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
