export async function getGroupMetadata(id, done) {
  let groupWid = await window.Store.WidFactory.createWid(id);
  let output = await window.Store.GroupMetadata.default.find(groupWid);
  if (done !== undefined) done(output);
  return output;
}
