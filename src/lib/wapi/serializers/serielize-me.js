export const _serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null
  }

  /*const connection = window.Store.State?.Socket?.state
    ? window.Store?.State?.Socket?.state
    : undefined */

  const newObj = {}

  // console.log(newObj.id)

  Object.assign(newObj, {
    id: obj.id ? obj.id : null,
    displayName: obj.displayName ? obj.displayName : null,
    verifiedName: obj.verifiedName ? obj.verifiedName : null,
    searchName: obj.searchName ? obj.searchName : null,
    pushname: obj.pushname ? obj.pushname : null,
    notifyName: obj.notifyName ? obj.notifyName : null,
    isBusiness: obj.isBusiness ? obj.isBusiness : null,
    formattedUser: obj.formattedUser ? obj.formattedUser : null,
    ...obj.profilePicThumb?.attributes,
    ...obj.businessProfile?.attributes,
  })
  return newObj
}
