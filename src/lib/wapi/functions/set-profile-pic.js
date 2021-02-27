export async function setProfilePic(obj, id) {
  if (!id) {
    id = Store.Me.attributes.wid._serialized;
  }
  let base64 = 'data:image/jpeg;base64,';
  return await Store.Profile.sendSetPicture(id, base64 + obj.b, base64 + obj.a);
}
