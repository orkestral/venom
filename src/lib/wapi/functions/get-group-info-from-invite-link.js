export async function getGroupInfoFromInviteLink(inviteCode) {
  // await Store.GroupInvite.queryGroupInviteCode(inviteCode);
  var groupInfo = await Store.WapQuery.groupInviteInfo(inviteCode);

  return groupInfo;
}
