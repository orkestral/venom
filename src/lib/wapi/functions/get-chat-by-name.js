export function getChatByName(name, done) {
  const found = Store.Chat.find((chat) => chat.name === name);
  if (done !== undefined) done(found);
  return found;
}
