export function addOnNewRevokes() {
  window.WAPI.onRevoked = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      window.Store.Msg.on('change:isOverwrittenByRevoke', (e) => {
        callback(e)
      })
    })
    return true
  }
}
