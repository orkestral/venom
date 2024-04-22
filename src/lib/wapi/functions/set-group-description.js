/**
 * Parameters to change group description
 * @param {string} groupId group number
 * @param {string} description group description
 */
export async function setGroupDescription(groupId, description) {
  if (typeof description != 'string' || description.length === 0) {
    return WAPI.scope(undefined, true, null, 'It is necessary to write a text!')
  }
  const chat = await WAPI.sendExist(groupId)
  if (chat && chat.status != 404) {
    const m = { type: 'setGroupDescription', description }
    const To = await WAPI.getchatId(chat.id)
    return Store.GroupDesc.setGroupDesc(chat, description)
      .then(() => {
        const obj = WAPI.scope(To, false, 'OK', description)
        Object.assign(obj, m)
        return obj
      })
      .catch(() => {
        const obj = WAPI.scope(To, true, 'error', description)
        Object.assign(obj, m)
        return obj
      })
  } else {
    return chat
  }
}
