export async function getHost() {
  const fromwWid = await Store.MaybeMeUser.getMaybeMeUser()
  if (fromwWid) {
    const idUser = await WAPI.sendExist(fromwWid._serialized)
    if (idUser && idUser.status !== 404) {
      //const infoUser = new Store.ProfileBusiness.BusinessProfile(idUser);
      const infoUser = await Store.Contacts.ContactCollection.get(
        fromwWid._serialized
      )
      //  const infoUser = await Store.MyStatus.getStatus(idUser.id);
      if (infoUser) {
        return await WAPI._serializeMeObj(infoUser)
      }
    }
  }
}
