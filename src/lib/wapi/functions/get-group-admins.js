import { _getGroupParticipants } from './get-group-participants';

export async function getGroupAdmins(id, done) {
  const output = (await _getGroupParticipants(id))
    .filter((participant) => participant.isAdmin)
    .map((admin) => admin.id);

  if (done !== undefined) done(output);
  return output;
}
