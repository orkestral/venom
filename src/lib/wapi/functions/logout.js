export async function logout() {
  if (window.Store.Login) {
    await window.Store.Login.startLogout();
    return true;
  } else {
    return false;
  }
}
