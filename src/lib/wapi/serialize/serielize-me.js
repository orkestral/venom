export const serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }
  const newObj = {};
  Object.assign(newObj, {
    id: obj.id ? obj.id : null,
    displayName: obj.displayName ? obj.displayName : null,
    verifiedName: obj.verifiedName ? obj.verifiedName : null,
    searchName: obj.searchName ? obj.searchName : null,
    pushname: obj.pushname ? obj.pushname : null,
    notifyName: obj.notifyName ? obj.notifyName : null,
    isBusiness: obj.isBusiness ? obj.isBusiness : null,
    formattedUser: obj.formattedUser ? obj.formattedUser : null,
    eurl: obj.profilePicThumb.attributes.eurl
      ? obj.profilePicThumb.attributes.eurl
      : null,
    ...obj.profilePicThumb.attributes,
    ...obj.businessProfile.attributes
  });
  return newObj;
};
