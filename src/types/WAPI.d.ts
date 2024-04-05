import {
  Chat,
  Contact,
  ContactStatus,
  GroupCreation,
  Message,
  // PartialMessage,
  SendFileResult,
  SendLinkResult,
  SendStickerResult,
  WhatsappProfile,
} from '../api/model'

interface WAPI {
  addParticipant: (groupId: string, contactId: string | string[]) => boolean
  onAnyMessage: (callback: Function) => void
  archiveChat: (chatId: string, option: boolean) => boolean
  arrayBufferToBase64: (buffer: ArrayBuffer) => string
  blockContact: (messageId: string) => boolean
  checkNumberStatus: (contactId: string) => Promise<WhatsappProfile>
  clearChatMessages: (chatId: string) => void
  createGroup: (
    groupName: string,
    contactId: string | string[]
  ) => GroupCreation
  deleteConversation: (chatId: string) => boolean
  deleteMessages: (contactId: string, messageId: string[]) => Promise<object>
  demoteParticipant: (groupId: string, contactId: string | string[]) => void
  downloadFile: (data: string) => Promise<string | boolean>
  downloadMedia: (messageId: string) => Promise<string>
  forwardMessages: (
    to: string,
    messages: string | string[],
    skipMyMessages: boolean
  ) => Promise<object>
  getAllChats: () => Promise<Chat[] | object[]>
  getAllChatIds: () => Promise<string[]>
  getAllChatsWithMessages: (withNewMessageOnly?: boolean) => Chat[]
  getAllChatsWithNewMsg: () => Chat[]
  getAllContacts: () => Contact[]
  getAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[]
  getAllMessagesDate: (
    chatId: string,
    type: string,
    idateStart: string,
    time: string,
    limit: number
  ) => Message[]

  getBatteryLevel: () => number
  getBlockList: () => Contact[]
  getBusinessProfilesProducts: (to: string) => any
  getChat: (contactId: string) => Chat
  getChatById: (contactId: string) => Chat
  getChatIsOnline: (chatId: string) => Promise<boolean>
  getLastSeen: (chatId: string) => Promise<number | boolean>
  getContact: (contactId: string) => Contact
  getGroupAdmins: (groupId: string) => Object
  getGroupInfoFromInviteLink: (inviteCode: string) => Promise<string | boolean>
  getGroupInviteLink: (chatId: string) => Promise<string>
  revokeGroupInviteLink: (chatId: string) => Promise<boolean>
  getGroupParticipant: (groupId: string, time: string) => Object
  getHost: () => any //HostDevice;
  getListMute: (type?: string) => object
  getStateConnection: () => String
  getNewMessageId: (chatId: string) => Object
  getMessageById: (messageId: string) => Promise<Message>
  getNumberProfile: (contactId: string) => Object
  getProfilePicFromServer: (chatId: string) => string
  getStatus: (contactId: string) => ContactStatus
  getTheme: () => string
  getUnreadMessages: (unread: boolean) => any
  getWAVersion: () => string
  isConnected: () => boolean
  isLoggedIn: () => boolean
  isBeta: () => boolean
  joinGroup: (groupId: string) => Promise<string | boolean>
  killServiceWorker: () => boolean
  setPresenceOffline: () => boolean
  setPresenceOnline: () => boolean
  leaveGroup: (groupId: string) => any
  loadAndGetAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[]
  loadEarlierMessages: (contactId: string) => Message[]
  logout: () => Promise<boolean>
  markUnseenMessage: (chatId: string) => boolean
  markMarkSeenMessage: (chatId: string) => boolean
  onAddedToGroup: (callback: Function) => any
  onIncomingCall: (callback: Function) => any
  onInterfaceChange: (callback: Function) => void
  onMessage: (callback: Function) => void
  onAck: (callback: Function) => void
  onPoll: (callback: Function) => void
  onLiveLocation: (chatId: string, callback: Function) => any
  onParticipantsChanged: (groupId: string, callback: Function) => any
  onStateChange: (callback: Function) => void
  openChat: (chatId: string, force?: string | boolean) => boolean
  openChatAt: (
    chatId: string,
    messageId: string
  ) => { wasVisible: boolean; alignAt: string }
  pinChat: (
    chatId: string,
    option: boolean,
    nonExistent?: boolean
  ) => Promise<object>
  promoteParticipant: (groupId: string, contactId: string | string[]) => void
  removeParticipant: (groupId: string, contactId: string | string[]) => void
  reply: (to: string, content: string, quotedMsg: string) => Promise<object>
  restartService: () => boolean
  sendChatstate: (chatState: string | any, chatId: string) => void
  sendContactVcard: (
    to: string,
    contact: string | string[],
    name?: string
  ) => Promise<object>
  sendContactVcardList: (to: string, contacts: string[]) => Promise<object>
  sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string,
    type?: string,
    status?: boolean,
    passId?: Object,
    checkNumber?: boolean,
    forcingReturn?: boolean,
    delSend?: boolean
  ) => Promise<SendFileResult>
  sendImage: (
    imgBase64: string,
    to: string,
    filename: string,
    caption?: string,
    type?: string | boolean,
    status?: boolean,
    passId?: Object
  ) => Promise<SendFileResult>
  sendImageAsSticker: (
    webpBase64: string,
    to: string,
    metadata?: any,
    type?: string
  ) => Promise<SendStickerResult>
  sendImageAsStickerGif: (
    webpBase64: string,
    to: string,
    metadata?: any
  ) => Promise<SendStickerResult>
  sendImageWithProduct: (
    base64: string,
    to: string,
    caption: string,
    bizNumber: string,
    productId: string
  ) => any
  sendLinkPreview: (
    chatId: string,
    url: string,
    title: string,
    message: string,
    thumbnail: string
  ) => Promise<SendLinkResult>
  sendLocation: (
    to: string,
    latitude: string,
    longitude: string,
    title: string
  ) => Promise<object>
  sendListMenu: (
    to: string,
    title: string,
    subTitle: string,
    description: string,
    buttonText: string,
    menu: Array<any>
  ) => Promise<Object>
  sendMessage: (
    to: string,
    content: string,
    status?: boolean,
    passId?: Object,
    checkNumber?: boolean,
    forcingReturn?: boolean,
    delSend?: boolean
  ) => Promise<Object>
  sendButtons: (
    to: string,
    title: string,
    buttons: object,
    subtitle: string
  ) => Promise<object>
  sendTypeButtons(
    to: string,
    title: string,
    subtitle: string,
    footer: string,
    buttons: any
  ): Promise<object>
  sendMessageMentioned: (...args: any) => any
  sendMessageOptions: (
    chat: any,
    content: any,
    options?: any
  ) => Promise<string>
  onlySendAdmin: (chatId: string, type: boolean) => Promise<any>
  sendMessageWithThumb: (
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) => void
  sendMute: (id: string, time: number, type: string) => Promise<object>
  sendPtt: (
    base64: string,
    to: string,
    passId?: object,
    checkNumber?: boolean,
    forcingReturn?: boolean,
    delSend?: boolean
  ) => any
  sendVideoAsGif: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void
  setMessagesAdminsOnly: (chatId: string, option: boolean) => boolean
  setMyName: (name: string) => void
  setMyStatus: (to: string) => void
  setProfilePic: (path: string | object, to?: string) => Promise<boolean>
  setGroupTitle: (groupId: string, title: string) => object
  setGroupSettings: (
    groupId: string,
    settings: string,
    value: boolean
  ) => Promise<object>
  setTheme: (theme?: string) => boolean
  startTyping: (to: string, checkNumber: boolean) => void
  startRecording: (to: string, checkNumber: boolean) => void
  markPaused: (to: string, checkNumber: boolean) => void
  clearPresence: (to: string) => void
  presenceAvailable: () => void
  presenceUnavailable: () => void
  takeOver: () => boolean
  unblockContact: (messageId: string) => boolean
  waitForStore: (store: string | string[], callback?: Function) => Promise<any>
  // waitNewAcknowledgements: (callback: Function) => void;
  waitNewMessages: (rmCallback: boolean, callback: Function) => void
  returnReply: (message: object) => object
  onStreamChange: (callback: Function) => void
  onFilePicThumb: (callback: Function) => void
  onChatState: (callback: Function) => void
  onUnreadMessage: (callback: Function) => void
  setGroupDescription: (groupId: string, description: string) => object
  sendReactions: (IdMessage: string, emoji: String) => void
  addChatWapi: () => void
  processMessageObj: (a: any, b: any, c: any) => any
  createCommunity: (name: string, description: string) => void
  sendPollCreation: (to: string, poll: any) => void
}

declare global {
  interface Window {
    WAPI: WAPI
  }
  const WAPI: WAPI
}
