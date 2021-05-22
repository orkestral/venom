export async function restartService() {
  await Store.ServiceWorker.default.restart();
  return true;
}
