export async function setProfilePic(obj, id) {
  if (!id) {
    id = await Store.MaybeMeUser.getMaybeMeUser();
  }
  let base64 = 'data:image/jpeg;base64,';
  return await Store.Profile.sendSetPicture(
    id._serialized,
    base64 + obj.b,
    base64 + obj.a
  );
}
