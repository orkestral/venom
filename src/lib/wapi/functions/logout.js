export async function logout() {
  if (window.Store.ws2) {
    await window.Store.ws2.logout();
    return true;
  } else {
    return false;
  }
}
