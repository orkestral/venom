let groupParticpiantsEvents = {};

/**
 * Registers on participants change listener
 */
export function addOnParticipantsChange() {
  /**
   * Registers a callback to participant changes on a certain, specific group
   * @param groupId - string - The id of the group that you want to attach the callback to.
   * @param callback - function - Callback function to be called when a message acknowledgement changes. The callback returns 3 variables
   * @returns {boolean}
   */
  window.WAPI.onParticipantsChanged = async function (groupId, callback) {
    return await window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      const subtypeEvents = [
        'invite',
        'add',
        'remove',
        'leave',
        'promote',
        'demote',
      ];
      const chat = window.Store.Chat.get(groupId);
      //attach all group Participants to the events object as 'add'
      const metadata = window.Store.GroupMetadata.default.get(groupId);
      if (!groupParticpiantsEvents[groupId]) {
        groupParticpiantsEvents[groupId] = {};
        metadata.participants.forEach((participant) => {
          groupParticpiantsEvents[groupId][participant.id.toString()] = {
            subtype: 'add',
            from: metadata.owner,
          };
        });
      }
      let i = 0;
      chat.on('change:groupMetadata.participants', (_) =>
        chat.on('all', (x, y) => {
          const { isGroup, previewMessage } = y;
          if (
            isGroup &&
            x === 'change' &&
            previewMessage &&
            previewMessage.type === 'gp2' &&
            subtypeEvents.includes(previewMessage.subtype)
          ) {
            const { subtype, from, recipients } = previewMessage;
            const rec = recipients[0].toString();
            if (
              groupParticpiantsEvents[groupId][rec] &&
              groupParticpiantsEvents[groupId][recipients[0]].subtype == subtype
            ) {
              //ignore, this is a duplicate entry
              // console.log('duplicate event')
            } else {
              //ignore the first message
              if (i == 0) {
                //ignore it, plus 1,
                i++;
              } else {
                groupParticpiantsEvents[groupId][rec] = {
                  subtype,
                  from,
                };
                //fire the callback
                // // previewMessage.from.toString()
                // x removed y
                // x added y
                callback({
                  by: from.toString(),
                  action: subtype,
                  who: recipients,
                });
                chat.off('all', this);
                i = 0;
              }
            }
          }
        })
      );
      return true;
    });
  };
}
