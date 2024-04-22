export async function setPresenceOffline() {
  await Store.Presence.setPresenceUnavailable()
  return true
}
