export function getAllGroups(done) {
  const groups = window.Store.Chat.filter((chat) => chat.isGroup)

  if (done !== undefined) done(groups)
  return groups
}
