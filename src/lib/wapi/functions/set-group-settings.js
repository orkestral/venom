/**
 * Parameters to change group title
 * @param {string} groupId group number
 * @param {GroupSettings} settings
 * @param {boolean} value
 */
export async function setGroupSettings(groupId, settings, value) {
  if (typeof settings != 'string' || settings.length === 0) {
    return WAPI.scope(
      undefined,
      true,
      null,
      'It is necessary to write a settings!'
    )
  }
  const chat = await WAPI.sendExist(groupId)
  if (chat && chat.status != 404) {
    const m = { type: 'setGroupSettings', settings }
    const To = await WAPI.getchatId(chat.id)
    const Value = { type: 'setGroupSettings', value }
    return window.Store.GroupSettings.sendSetGroupProperty(
      chat.id,
      settings,
      value
    )
      .then(() => {
        const obj = WAPI.scope(To, false, 'OK', m, Value)
        Object.assign(obj, m)
        return obj
      })
      .catch(() => {
        const obj = WAPI.scope(To, true, 'error', m, Value)
        Object.assign(obj, m)
        return obj
      })
  } else {
    return chat
  }
}
