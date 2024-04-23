export async function filterModule(filterObjects, modules) {
  let found = 0
  for (const i in modules) {
    if (typeof modules[i] === 'object' && modules[i] !== null) {
      filterObjects.forEach((needObj) => {
        if (!needObj.when | needObj.yesModule) return

        const checkObj = needObj.when(modules[i])
        if (checkObj !== null) {
          found++
          needObj.yesModule = checkObj
        }
      })
      if (found == filterObjects.length) {
        break
      }
    }
  }
  return filterObjects
}
