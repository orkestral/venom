export async function getGroupMetadata(id, done) {
  const groupWid = await window.Store.WidFactory.createWid(id)
  const output = await window.Store.GroupMetadata.default.find(groupWid)
  if (done !== undefined) done(output)
  return output
}
