export async function joinGroup(inviteCode) {
  var result = await Store.WapQuery.acceptGroupInvite(inviteCode)
  return result
}
