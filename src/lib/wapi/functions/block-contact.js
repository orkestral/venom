export async function blockContact(_id) {
  if (!_id) {
    return false;
  }
  const __contact = window.Store.Contact.get(_id);
  if (__contact !== undefined) {
    await Store.Block.blockContact(__contact);
    return true;
  } else {
    return false;
  }
}
