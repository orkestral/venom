export async function getAllChatsWithMessages(newOnly) {
  const x = []
  if (newOnly) {
    x.push(
      WAPI.getAllChatsWithNewMsg().map(
        async (c) => await WAPI.getChat(c.id._serialized)
      )
    )
  } else {
    x.push(WAPI.getAllChatIds().map(async (c) => await WAPI.getChat(c)))
  }
  const _result = (await Promise.all(x)).flatMap((x) => x)
  const result = JSON.stringify(_result)
  return JSON.parse(result)
}
