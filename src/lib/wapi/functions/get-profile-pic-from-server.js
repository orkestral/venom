export async function getProfilePicFromServer(id) {
  const pinc = await Store.WapQuery.profilePicFind(id).then((x) => x.eurl);
  return pinc;
}
