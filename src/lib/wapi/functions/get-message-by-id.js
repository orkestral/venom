import { NUMBER_SUFIX } from '../constants/number-suffix'
import { normalizePhoneNumber } from '../helper/normalize-phone-number'

export async function getMessageById(
  key,
  done,
  serialize = true,
  limitIterationFindMessage = 1,
  retrying = false
) {
  // Check message is loaded in store
  let msg = window.Store.Msg.get(key)

  if (!msg) {
    const splittedKey = key.split('_')
    const chatId = splittedKey[1]

    let chat
    try {
      chat = window.Store.Chat.get(chatId)
    } catch (err) {
      return { erro: 'error trying to find chat' }
    }

    if (!chat) {
      if (!retrying) {
        return await getMessageById(
          normalize(key),
          done,
          serialize,
          limitIterationFindMessage,
          true
        )
      }
      return { erro: 'chat not found' }
    }

    msg = window.Store.Msg.get(key)
    if (!msg) {
      let i = 0
      while (
        limitIterationFindMessage === 0 ||
        ++i <= limitIterationFindMessage
      ) {
        const msgs = await window.Store.ChatLoadMessages.loadEarlierMsgs(chat)
        if (!msgs || msgs.length === 0) {
          break
        }
        msg = window.Store.Msg.get(key)
        if (msg) {
          break
        }
      }
    }

    if (!msg && !retrying) {
      return await getMessageById(
        normalize(key),
        done,
        serialize,
        limitIterationFindMessage,
        true
      )
    }
  }

  if (!msg) {
    return { erro: 'message not found' }
  }

  let result = { erro: 'message not found' }

  if (serialize) {
    try {
      result = await WAPI.processMessageObj(msg, true, true)
    } catch (err) {}
  } else {
    result = msg
  }

  if (typeof done === 'function') {
    done(result)
  } else {
    return result
  }
}

const normalize = (key) => {
  const splittedKey = key.split('_')

  const chatId = splittedKey[1]
  const prefix = splittedKey[0]
  const msgId = splittedKey[2]

  if (chatId.includes(NUMBER_SUFIX.CONTACT)) {
    return `${prefix}_${normalizePhoneNumber(chatId)}_${msgId}`
  } else if (chatId.includes(NUMBER_SUFIX.GROUP)) {
    const numberPhone = splittedKey[3]
    return `${prefix}_${chatId}_${msgId}_${normalizePhoneNumber(numberPhone)}`
  }
}
