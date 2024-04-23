export async function setMyName(name) {
  await window.Store.Perfil.setPushname(name)
}
