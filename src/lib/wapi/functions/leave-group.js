export async function leaveGroup(groupId) {
  groupId = typeof groupId == 'string' ? groupId : groupId._serialized;
  var group = await WAPI.getChat(groupId);
  return Store.GroupActions.sendExitGroup(group);
}
