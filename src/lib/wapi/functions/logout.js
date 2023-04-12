export async function logout() {
  if (window.Store.Login) {
    await window.Store.Login.triggerCriticalSyncLogout();
    return true;
  } else {
    return false;
  }
}
