export async function getCommonGroups(participantId, done) {
  const output = []
  const groups = window.WAPI.getAllGroups()
  for (const idx in groups) {
    try {
      const participants = await window.WAPI.getGroupParticipant(groups[idx].id)
      if (
        participants.filter((participant) => participant == participantId)
          .length
      ) {
        output.push(groups[idx])
      }
    } catch (err) {
      console.log('Error in group:')
      console.log(groups[idx])
      console.log(err)
    }
  }

  if (done !== undefined) {
    done(output)
  }
  return output
}
