import { _getGroupParticipants } from './get-group-participants';

export async function getGroupParticipantIDs(groupId, done) {
  const output = (await _getGroupParticipants(groupId)).map(
    (participant) => participant.id
  );

  if (done !== undefined) done(output);
  return output;
}
