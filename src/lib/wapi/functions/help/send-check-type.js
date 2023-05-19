export function sendCheckType(chatId = undefined) {
  if (!chatId) {
    return WAPI.scope(chatId, true, 404, 'It is necessary to pass a number!');
  }
  if (typeof chatId === 'string') {
    const contact = '@c.us';
    const broadcast = '@broadcast';
    const grup = '@g.us';
    if (
      contact !== chatId.substr(-contact.length, contact.length) &&
      broadcast !== chatId.substr(-broadcast.length, broadcast.length) &&
      grup !== chatId.substr(-grup.length, grup.length)
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'The chat number must contain the parameters @c.us, @broadcast or @g.us. At the end of the number!'
      );
    }
    if (
      contact === chatId.substr(-contact.length, contact.length) &&
      ((chatId.match(/(@c.us)/g) && chatId.match(/(@c.us)/g).length > 1) ||
        !chatId.match(/^(\d+(\d)*@c.us)$/g))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 000000000000@c.us'
      );
    }

    if (
      broadcast === chatId.substr(-broadcast.length, broadcast.length) &&
      (chatId.match(/(@broadcast)/g).length > 1 ||
        (!chatId.match(/^(\d+(\d)*@broadcast)$/g) &&
          !chatId.match(/^(status@broadcast)$/g)))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 0000000000@broadcast'
      );
    }

    if (
      grup === chatId.substr(-grup.length, grup.length) &&
      ((chatId.match(/(@g.us)/g) && chatId.match(/(@g.us)/g).length > 1) ||
        !chatId.match(/^(\d+(-)+(\d)|\d+(\d))*@g.us$/g))
    ) {
      return WAPI.scope(
        chatId,
        true,
        404,
        'incorrect parameters! Use as an example: 00000000-000000@g.us or 00000000000000@g.us'
      );
    }
  }
}
