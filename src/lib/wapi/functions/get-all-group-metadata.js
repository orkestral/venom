export function getAllGroupMetadata(done) {
  const groupData = window.Store.GroupMetadata.default.map(
    (groupData) => groupData.attributes
  );

  if (done !== undefined) done(groupData);
  return groupData;
}
