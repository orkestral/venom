export function getAllGroupMetadata(done) {
  const groupData = window.Store.GroupMetadata.map(
    (groupData) => groupData.attributes
  );

  if (done !== undefined) done(groupData);
  return groupData;
}
