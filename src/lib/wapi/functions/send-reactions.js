export async function sendReactions(IdMessage, emoji = '🐙') {
  if (!IdMessage && IdMessage.length && typeof IdMessage === 'string') {
    return WAPI.scope(
      undefined,
      true,
      null,
      'necessary to pass the id of the message!'
    );
  }
  const checkMsg = await Store.Msg.find(IdMessage);
  if (typeof checkMsg === 'object') {
    return Store.Reactions.sendReactionToMsg(checkMsg, emoji);
  }
  return WAPI.scope(undefined, true, null, 'Message id not found!');
}
