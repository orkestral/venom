export async function setProfilePic(obj, id) {
  if (!id) {
    id = await Store.MaybeMeUser.getMaybeMeUser()
  } else {
    id = new Store.WidFactory.createWid(id)
  }
  const base64 = 'data:image/jpeg;base64,'
  return await Store.Profile.sendSetPicture(id, base64 + obj.b, base64 + obj.a)
}
