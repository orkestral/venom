export const storeObjects = [
  {
    id: 'module',
    conditions: (module) =>
      module.default && module.default.Chat && module.default.Msg
        ? module.default
        : null,
  },
  {
    id: 'replyButton',
    conditions: (module) =>
      module.__esModule &&
      module.default &&
      module.default.prototype &&
      module.default.prototype.proxyName === 'replyButton'
        ? module.default
        : null,
  },
  {
    id: 'templateButton',
    conditions: (module) =>
      module.__esModule &&
      module.default &&
      module.default.prototype &&
      module.default.prototype.proxyName === 'templateButton'
        ? module.default
        : null,
  },
  {
    id: 'TemplateButtonCollection',
    conditions: (module) =>
      module.TemplateButtonCollection ? module.TemplateButtonCollection : null,
  },
  {
    id: 'ButtonCollection',
    conditions: (module) =>
      module.ButtonCollection ? module.ButtonCollection : null,
  },
  {
    id: 'MediaCollection',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      (module.default.prototype.processFiles !== undefined ||
        module.default.prototype.processAttachments !== undefined)
        ? module.default
        : null,
  },
  { id: 'MediaProcess', conditions: (module) => (module.BLOB ? module : null) },
  {
    id: 'ChatUtil',
    conditions: (module) => (module.sendClear ? module : null),
  },
  {
    id: 'GroupInvite',
    conditions: (module) =>
      module.queryGroupInviteCode && module.revokeGroupInvite ? module : null,
  },
  {
    id: 'Wap',
    conditions: (module) => (module.createGroup ? module : null),
  },
  {
    id: 'ServiceWorker',
    conditions: (module) =>
      module.default && module.default.killServiceWorker ? module : null,
  },
  {
    id: 'WapDelete',
    conditions: (module) =>
      module.sendConversationDelete &&
      module.sendConversationDelete.length === 2
        ? module
        : null,
  },
  {
    id: 'Conn',
    conditions: (module) =>
      module.default && module.default.ref && module.default.refTTL
        ? module.default
        : null,
  },
  {
    id: 'WapQuery',
    conditions: (module) =>
      module.default &&
      module.default.contactFindQuery &&
      module.default.queryExist
        ? module.default
        : null,
  },
  {
    id: 'CryptoLib',
    conditions: (module) => (module.decryptE2EMedia ? module : null),
  },
  {
    id: 'OpenChat',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.openChat
        ? module.default
        : null,
  },
  {
    id: 'UserConstructor',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.isServer &&
      module.default.prototype.isUser
        ? module.default
        : null,
  },
  {
    id: 'SendTextMsgToChat',
    conditions: (module) =>
      module.sendTextMsgToChat ? module.sendTextMsgToChat : null,
  },
  {
    id: 'Archive',
    conditions: (module) => (module.setArchive ? module : null),
  },
  {
    id: 'pinChat',
    conditions: (module) => (module.setPin ? module : null),
  },
  {
    id: 'sendDelete',
    conditions: (module) => (module.sendDelete ? module.sendDelete : null),
  },
  {
    id: 'addAndSendMsgToChat',
    conditions: (module) =>
      module.addAndSendMsgToChat ? module.addAndSendMsgToChat : null,
  },
  {
    id: 'sendMsgToChat',
    conditions: (module) =>
      module.sendMsgToChat ? module.sendMsgToChat : null,
  },
  {
    id: 'Catalog',
    conditions: (module) => (module.Catalog ? module.Catalog : null),
  },
  {
    id: 'Perfil',
    conditions: (module) =>
      module.__esModule === true &&
      module.setPushname &&
      !module.getComposeContents
        ? module
        : null,
  },
  {
    id: 'MsgKey',
    conditions: (module) =>
      module.default &&
      module.default.toString &&
      typeof module.default.toString === 'function' &&
      module.default.toString().includes('MsgKey error: obj is null/undefined')
        ? module.default
        : null,
  },
  {
    id: 'Parser',
    conditions: (module) =>
      module.convertToTextWithoutSpecialEmojis ? module.default : null,
  },
  {
    id: 'Builders',
    conditions: (module) =>
      module.TemplateMessage && module.HydratedFourRowTemplate ? module : null,
  },
  {
    id: 'Me',
    conditions: (module) =>
      module.Conn && module.ConnImpl ? module.Conn : null,
  },
  {
    id: 'CallUtils',
    conditions: (module) =>
      module.sendCallEnd && module.parseCall ? module : null,
  },
  {
    id: 'Identity',
    conditions: (module) =>
      module.queryIdentity && module.updateIdentity ? module : null,
  },
  {
    id: 'MyStatus',
    conditions: (module) =>
      module.getStatus && module.setMyStatus ? module : null,
  },
  {
    id: 'ChatStates',
    conditions: (module) =>
      module.sendChatStatePaused &&
      module.sendChatStateRecording &&
      module.sendChatStateComposing
        ? module
        : null,
  },
  {
    id: 'GroupActions',
    conditions: (module) =>
      module.sendExitGroup && module.localExitGroup ? module : null,
  },
  {
    id: 'Features',
    conditions: (module) =>
      module.FEATURE_CHANGE_EVENT && module.features ? module : null,
  },
  {
    id: 'MessageUtils',
    conditions: (module) =>
      module.storeMessages && module.appendMessage ? module : null,
  },
  {
    id: 'createMessageKey',
    conditions: (module) =>
      module.createMessageKey && module.createDeviceSentMessage
        ? module.createMessageKey
        : null,
  },
  {
    id: 'WidFactory',
    conditions: (module) =>
      module.isWidlike && module.createWid && module.createWidFromWidLike
        ? module
        : null,
  },
  {
    id: 'Base',
    conditions: (module) =>
      module.setSubProtocol && module.binSend && module.actionNode
        ? module
        : null,
  },
  {
    id: 'Base2',
    conditions: (module) =>
      module.supportsFeatureFlags &&
      module.parseMsgStubProto &&
      module.binSend &&
      module.subscribeLiveLocation
        ? module
        : null,
  },
  {
    id: 'MaybeMeUser',
    conditions: (module) => (module.getMaybeMeUser ? module : null),
  },
  {
    id: 'Sticker',
    conditions: (module) =>
      module.StickerCollection && module.default ? module : null,
  },
  {
    id: 'MediaObject',
    conditions: (module) =>
      module.getOrCreateMediaObject && module.disassociateMediaFromStickerPack
        ? module
        : null,
  },
  {
    id: 'MediaUpload',
    conditions: (module) =>
      module.default && module.default.mediaUpload ? module.default : null,
  },
  {
    id: 'UploadUtils',
    conditions: (module) =>
      module.default && module.default.encryptAndUpload ? module.default : null,
  },
  {
    id: 'Cmd',
    conditions: (module) => (module.CmdImpl && module.Cmd ? module.Cmd : null),
  },
  {
    id: 'ReadSeen',
    conditions: (module) => (module.sendSeen ? module : null),
  },
  {
    id: 'Block',
    conditions: (module) =>
      module.blockContact && module.unblockContact ? module : null,
  },
  {
    id: 'BlockList',
    conditions: (module) => (module.BlocklistCollection ? module : null),
  },
  {
    id: 'Theme',
    conditions: (module) =>
      module.getTheme && module.setTheme ? module : null,
  },
  {
    id: 'Vcard',
    conditions: (module) => (module.vcardFromContactModel ? module : null),
  },
  {
    id: 'Profile',
    conditions: (module) =>
      module.sendSetPicture && module.requestDeletePicture ? module : null,
  },
  {
    id: 'SendMute',
    conditions: (module) => (module.sendConversationMute ? module : null),
  },
  {
    id: 'Validators',
    conditions: (module) => (module.findLinks ? module : null),
  },
  {
    id: 'Wap2',
    conditions: (module) => (module.Wap ? module : null),
  },
  {
    id: 'genId',
    conditions: (module) =>
      module.default &&
      typeof module.default === 'function' &&
      module.default.toString().match(/crypto/)
        ? module
        : null,
  },
  {
    id: 'GroupMetadata',
    conditions: (module) =>
      module.default && module.default.handlePendingInvite ? module : null,
  },
  {
    id: 'i10n',
    conditions: (module) =>
      module.default && module.default.downloadAppLocale
        ? module.default
        : null,
  },
  {
    id: 'NetworkStatus',
    conditions: (module) =>
      module.default && module.default._logOnlineOffline
        ? module.default
        : null,
  },
  {
    id: 'Stream',
    conditions: (module) =>
      module.Stream && module.StreamInfo ? module.Stream : null,
  },
  {
    id: 'State',
    conditions: (module) => (module.Socket ? module : null),
  },
  {
    id: 'ws2',
    conditions: (module) =>
      module.default && module.default.destroyStorage ? module.default : null,
  },
  {
    id: 'Login',
    conditions: (module) => (module.startLogout ? module : null),
  },
  {
    id: 'BlobCache',
    conditions: (module) =>
      module.default && module.default.getOrCreateURL ? module.default : null,
  },
  {
    id: 'Presence',
    conditions: (module) =>
      module.setPresenceAvailable && module.setPresenceUnavailable
        ? module
        : null,
  },
  {
    id: 'PresenceCollection',
    conditions: (module) =>
      module.default && module.PresenceCollection ? module.default : null,
  },
  {
    id: 'chatOptions',
    conditions: (module) =>
      module.default && module.default.archiveChat ? module.default : null,
  },
  {
    id: 'blob',
    conditions: (module) =>
      module.default && module.default.createFromData ? module : null,
  },
  {
    id: 'GroupDesc',
    conditions: (module) => (module.setGroupDesc ? module : null),
  },
  {
    id: 'infoGroup',
    conditions: (module) => (module.queryGroupInviteInfo ? module : null),
  },
  {
    id: 'GroupTitle',
    conditions: (module) => (module.sendSetGroupSubject ? module : null),
  },
  {
    id: 'GroupSettings',
    conditions: (module) => (module.sendSetGroupProperty ? module : null),
  },
  {
    id: 'createGroup',
    conditions: (module) =>
      module.createGroup && module.sendForNeededAddRequest
        ? module.createGroup
        : null,
  },
  {
    id: 'SetStatusChat',
    conditions: (module) =>
      module.markComposing && module.markRecording ? module : null,
  },
  {
    id: 'Reactions',
    conditions: (module) => (module.sendReactionToMsg ? module : null),
  },
  {
    id: 'CheckWid',
    conditions: (module) => (module.validateWid ? module : null),
  },
  {
    id: 'ProfileBusiness',
    conditions: (module) => (module.BUSINESS_URL_DOMAIN ? module : null),
  },
  {
    id: 'Contacts',
    conditions: (module) => (module.ContactCollection ? module : null),
  },
  {
    id: 'onlySendAdmin',
    conditions: (module) =>
      module.setGroupProperty && module.setGroupDescription ? module : null,
  },
  {
    id: 'SendCommunity',
    conditions: (module) => (module.sendCreateCommunity ? module : null),
  },
  {
    id: 'Websocket',
    conditions: (module) => (module.smax ? module : null),
  },
  {
    id: 'Survey',
    conditions: (module) => (module.sendPollCreation ? module : null),
  },
  {
    id: 'Cmd',
    conditions: (module) => (module.APP_STATE_SYNC_COMPLETED ? module : null),
  },
  {
    id: 'Wap',
    conditions: (module) => (module.BIG_ENDIAN_CONTENT ? module : null),
  },
  {
    id: 'WapParser',
    conditions: (module) => (module.WapParser ? module : null),
  },
  {
    id: 'SendSocket',
    conditions: (module) => (module.deprecatedSendIq ? module : null),
  },
  {
    id: 'Jid',
    conditions: (module) => (module.WAP_JID_SUBTYPE ? module : null),
  },
  {
    id: 'sendDeleteMsgs',
    conditions: (module) =>
      module.sendDeleteMsgs ? module.sendDeleteMsgs : null,
  },
  {
    id: 'sendRevokeMsgs',
    conditions: (module) =>
      module.sendRevokeMsgs ? module.sendRevokeMsgs : null,
  },
  {
    id: 'createNewsletterQuery',
    conditions: (module) => (module.createNewsletterQuery ? module : null),
  },
  {
    id: 'userJidToUserWid',
    conditions: (module) => (module.newsletterJidToWid ? module : null),
  },
  {
    id: 'ChatLoadMessages',
    conditions: (module) =>
      module.loadRecentMsgs &&
      module.loadEarlierMsgs &&
      module.loadMsgsPromiseLoop
        ? module
        : null,
  },
]
