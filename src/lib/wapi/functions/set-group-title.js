/**
 * Parameters to change group title
 * @param {string} groupId group number
 * @param {string} title group name
 */
export async function setGroupTitle(groupId, title) {
  if (typeof title != 'string' || title.length === 0) {
    return WAPI.scope(
      undefined,
      true,
      null,
      'It is necessary to write a text!'
    );
  }
  const chat = await WAPI.sendExist(groupId);
  if (chat && chat.status != 404) {
    const m = { type: 'setGroupTitle', title };
    const To = await WAPI.getchatId(chat.id);
    return window.Store.GroupTitle.sendSetGroupSubject(chat.id, title)
      .then(() => {
        const obj = WAPI.scope(To, false, 'OK', title);
        Object.assign(obj, m);
        return obj;
      })
      .catch(() => {
        const obj = WAPI.scope(To, true, 'error', title);
        Object.assign(obj, m);
        return obj;
      });
  } else {
    return chat;
  }
}
