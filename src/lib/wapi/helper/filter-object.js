export const filterObjects = [
  {
    type: 'Chat',
    when: (module) =>
      module.default && module.default.Chat && module.default.Msg
        ? module.default.Chat
        : null,
  },
  {
    type: 'MaybeMeUser',
    when: (module) => (module.getMaybeMeUser ? module : null),
  },
  {
    type: 'Participants',
    when: (module) =>
      module.addParticipants && module.promoteCommunityParticipants
        ? module
        : null,
  },
  {
    type: 'GroupModifyParticipantsJob',
    when: (module) =>
      module.addGroupParticipants && module.removeGroupParticipants
        ? module
        : null,
  },
  {
    type: 'GroupCreateJob',
    when: (module) =>
      module.createGroup && !module.sendForNeededAddRequest ? module : null,
  },
  {
    type: 'checkNumber',
    when: (module) => (module.queryExist ? module : null),
  },
  {
    type: 'checkNumberBeta',
    when: (module) => (module.queryPhoneExists ? module : null),
  },
  {
    type: 'sendDeleteMsgs',
    when: (module) => (module.sendDeleteMsgs ? module.sendDeleteMsgs : null),
  },
  {
    type: 'sendRevokeMsgs',
    when: (module) => (module.sendRevokeMsgs ? module.sendRevokeMsgs : null),
  },
]
