export const filterObjects = [
  {
    type: 'Chat',
    when: (module) =>
      module.default && module.default.Chat && module.default.Msg
        ? module.default.Chat
        : null
  },
  {
    type: 'MaybeMeUser',
    when: (module) => (module.getMaybeMeUser ? module : null)
  }
];
