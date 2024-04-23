/* export async function _getGroupParticipants(id, done) {
  const output = Promise.resolve(WAPI.group.getParticipants(id)).then(
    (participants) => participants.map((p) => p.toJSON())
  );
  if (done !== undefined) done(output);
  return output;
} */
