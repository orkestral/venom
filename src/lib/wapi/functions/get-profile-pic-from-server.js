export function getProfilePicFromServer(id) {
  return Store.WapQuery.profilePicFind(id).then((x) => x.eurl);
}
