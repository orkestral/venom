export function addonUnreadMessage() {
  window.WAPI.onUnreadMessage = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      window.Store.Chat.on('change:unreadCount', async (e) => {
        if (e.unreadCount > 0) {
          const arr = []
          const t = e.msgs._models.slice(-e.unreadCount)
          for (const r in t) {
            const message = await WAPI.processMessageObj(t[r], true, true)
            if (message) {
              arr.push(message)
            }
          }
          callback(arr)
        }
      })
    })
    return true
  }
}
