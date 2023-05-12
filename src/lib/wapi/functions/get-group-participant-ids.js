export async function getGroupParticipantIDs(groupId, done) {
  const output = Promise.resolve(WPP.group.getParticipants(groupId)).then(
    (participants) => participants.map((p) => p.toJSON())
  );

  if (done !== undefined) done(output);
  return output;
}
