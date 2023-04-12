export async function getGroupInfoFromInviteLink(inviteCode) {
  var groupInfo = await Store.infoGroup.queryGroupInviteInfo(inviteCode);
  return groupInfo;
}
