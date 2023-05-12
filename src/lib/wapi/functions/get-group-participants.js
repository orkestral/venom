export async function _getGroupParticipants(id, done) {
  const output = Promise.resolve(WPP.group.getParticipants(id)).then(
    (participants) => participants.map((p) => p.toJSON())
  );

  if (done !== undefined) done(output);
  return output;
}
