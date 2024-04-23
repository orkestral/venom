export async function setTheme(type) {
  if (type == 'dark' || type == 'light') {
    await Store.Theme.setTheme(type)
    return true
  } else {
    return console.error('Use type dark or light')
  }
}

export async function getTheme() {
  return await Store.Theme.getTheme()
}
