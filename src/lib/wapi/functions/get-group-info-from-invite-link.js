export async function getGroupInfoFromInviteLink(link) {
  if (typeof link === 'string' && !link) {
    return null;
  }
  const regex = /https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/;
  const match = link.match(regex);
  const input = match ? match[1] : link;
  const data = await Store.infoGroup.queryGroupInviteInfo(input);
  return {
    inGroup: data?.inGroup,
    membershipApprovalRequest: data?.membershipApprovalRequest,
    parentGroupSubject: data?.parentGroupSubject,
    status: data?.status,
    subject: data?.subject,
    id: data?.groupMetadata?.id
  };
}
