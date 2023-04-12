export async function createCommunity(name, desc) {
  try {
    const options = {
      name: name,
      desc: desc,
      closed: true
    };
    await window.Store.SendCommunity.sendCreateCommunity(options);
    return true;
  } catch {
    return false;
  }
}
