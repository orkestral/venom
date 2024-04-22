export async function setPresenceOnline() {
  await Store.Presence.setPresenceAvailable()
  return true
}
