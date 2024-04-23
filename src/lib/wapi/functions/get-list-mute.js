export async function getListMute(type = 'all') {
  var muteList = (await window.Store.Mute)._models,
    noMute = [],
    toMute = []
  for (var i in muteList)
    muteList[i].__x_isMuted
      ? toMute.push(WAPI.interfaceMute(muteList[i]))
      : noMute.push(WAPI.interfaceMute(muteList[i]))
  var r = null
  console.log(0, type)
  switch (type) {
    case 'all':
      r = [
        {
          total: toMute.length + noMute.length,
          amountToMute: toMute.length,
          amountnoMute: noMute.length,
        },
        toMute,
        noMute,
      ]
      break
    case 'toMute':
      r = [{ total: toMute.length }, toMute]
      break
    case 'noMute':
      r = [{ total: noMute.length }, noMute]
      break
  }
  return r
}
export function interfaceMute(arr) {
  const { attributes, expiration, id, isMuted, isState, promises, stale } = arr
  return { attributes, expiration, id, isMuted, isState, promises, stale }
}
