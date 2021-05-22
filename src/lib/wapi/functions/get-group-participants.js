export async function _getGroupParticipants(id) {
  const metadata = await WAPI.getGroupMetadata(id);
  return metadata.participants;
}
