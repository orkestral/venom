export async function killServiceWorker() {
  await Store.ServiceWorker.default.killServiceWorker()
  return true
}
