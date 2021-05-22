export async function unblockContact(_id) {
  if (!_id) {
    return false;
  }
  const __contact = window.Store.Contact.get(_id);
  if (__contact !== undefined) {
    await Store.Block.unblockContact(__contact);
    return true;
  } else {
    return false;
  }
}
