export async function getCommonGroups(participantId, done) {
  let output = [];
  let groups = window.WAPI.getAllGroups();
  for (let idx in groups) {
    try {
      let participants = await window.WAPI.getGroupParticipantIDs(
        groups[idx].id
      );
      if (
        participants.filter((participant) => participant == participantId)
          .length
      ) {
        output.push(groups[idx]);
      }
    } catch (err) {
      console.log('Error in group:');
      console.log(groups[idx]);
      console.log(err);
    }
  }

  if (done !== undefined) {
    done(output);
  }
  return output;
}
