import { sleep } from '../helper';

export async function getGroupParticipant(groupId, time = 1000) {
  if (typeof groupId !== 'string') {
    return WAPI.scope(undefined, true, null, 'Use to groupId string');
  }

  const moduleGroup = await window.Store.GroupMetadata._models.filter(
    (e) => e.id._serialized === groupId
  );

  const participants =
    moduleGroup.length && moduleGroup[0].participants
      ? moduleGroup[0].participants
      : undefined;

  if (participants) {
    const output = participants.map((participant) => {
      return {
        id: participant.id,
        displayName:
          participant.contact && participant.contact.displayName
            ? participant.contact.displayName
            : null,
        mentionName:
          participant.contact && participant.contact.mentionName
            ? participant.contact.mentionName
            : null,
        notifyName:
          participant.contact && participant.contact.notifyName
            ? participant.contact.notifyName
            : null,
        isBusiness:
          participant.contact && participant.contact.isBusiness
            ? participant.contact.isBusiness
            : null,
        pushname:
          participant.contact && participant.contact.pushname
            ? participant.contact.pushname
            : null,
        isUser:
          participant.contact && participant.contact.isUser
            ? participant.contact.isUser
            : null,
        isMyContact:
          participant.contact && participant.contact.isMyContact
            ? participant.contact.isMyContact
            : null,
        isMe:
          participant.contact && participant.contact.isMe
            ? participant.contact.isMe
            : null
      };
    });

    return output;
  }
  return WAPI.scope(undefined, true, null, 'Error find Group');
}
