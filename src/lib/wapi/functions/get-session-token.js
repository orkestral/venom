export async function getSessionTokenBrowser() {
  if (window.localStorage) {
    var localStorages = await JSON.parse(JSON.stringify(window.localStorage))
    const { WABrowserId, WASecretBundle, WAToken1, WAToken2 } = localStorages
    return {
      WABrowserId,
      WASecretBundle,
      WAToken1,
      WAToken2,
    }
  }
}
