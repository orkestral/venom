export function isBeta() {
  if (
    !window.localStorage.getItem('WASecretBundle') &&
    !window.localStorage.getItem('WAToken1') &&
    !window.localStorage.getItem('WAToken2')
  ) {
    return true;
  }
  return false;
}
