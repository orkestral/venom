export function addOnStateChange() {
  let initialized = false
  const getData = () => {
    return window.Store.State.Socket.state
  }

  window.WAPI.onStateChange = function (callback) {
    window.WAPI.waitForStore('State', () => {
      window.Store.State.Socket.on('change:state', () => callback(getData()))
      if (!initialized) {
        initialized = true
        callback(getData())
      }
    })
    return true
  }
}

export function addOnStreamChange() {
  let initialized = false
  const getData = () => {
    return window.Store.State.Socket.stream
  }

  window.WAPI.onStreamChange = function (callback) {
    window.WAPI.waitForStore('State', () => {
      window.Store.State.Socket.on('change:stream', () => callback(getData()))
      if (!initialized) {
        initialized = true
        callback(getData())
      }
    })
    return true
  }
}
