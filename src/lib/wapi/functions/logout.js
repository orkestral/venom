export async function logout() {
  if (Store.State.Socket) {
    await Store.State.Socket.logout()
    return true
  } else {
    return false
  }
}
