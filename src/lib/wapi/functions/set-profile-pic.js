export async function setProfilePic(obj, id) {
  if (!id) {
    id = Store.MaybeMeUser.getMaybeMeUser();
  } else {
    id = window.Store.WidFactory.createWid(id);
  }
  let base64 = 'data:image/jpeg;base64,';
  return await Store.Profile.sendSetPicture(id, base64 + obj.b, base64 + obj.a);
}
