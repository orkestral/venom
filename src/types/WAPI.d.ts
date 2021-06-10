import {
  Chat,
  Contact,
  ContactStatus,
  GroupCreation,
  HostDevice,
  Id,
  Message,
  PartialMessage,
  SendFileResult,
  SendLinkResult,
  SendStickerResult,
  WhatsappProfile,
} from '../api/model';
import { tokenSession } from '../config/tokenSession.config';

interface WAPI {
  addParticipant: (groupId: string, contactId: string | string[]) => boolean;
  allNewMessagesListener: (callback: Function) => void;
  archiveChat: (chatId: string, option: boolean) => boolean;
  arrayBufferToBase64: (buffer: ArrayBuffer) => string;
  blockContact: (messageId: string) => boolean;
  checkNumberStatus: (contactId: string) => Promise<WhatsappProfile>;
  clearChatMessages: (chatId: string) => void;
  createGroup: (
    groupName: string,
    contactId: string | string[]
  ) => GroupCreation;
  deleteConversation: (chatId: string) => boolean;
  deleteMessages: (contactId: string, messageId: string[]) => Promise<object>;
  demoteParticipant: (groupId: string, contactId: string | string[]) => void;
  downloadFile: (data: string) => Promise<string | boolean>;
  downloadMedia: (messageId: string) => Promise<string>;
  forwardMessages: (
    to: string,
    messages: string | string[],
    skipMyMessages: boolean
  ) => Promise<object>;
  getAllChats: () => Chat[];
  getAllChatsWithMessages: (withNewMessageOnly?: boolean) => Chat[];
  getAllChatsWithNewMsg: () => Chat[];
  getAllContacts: () => Contact[];
  getAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
  getAllUnreadMessages: () => PartialMessage[];
  getBatteryLevel: () => number;
  getBlockList: () => Contact[];
  getBusinessProfilesProducts: (to: string) => any;
  getChat: (contactId: string) => Chat;
  getChatById: (contactId: string) => Chat;
  getChatIsOnline: (chatId: string) => Promise<boolean>;
  getLastSeen: (chatId: string) => Promise<number | boolean>;
  getContact: (contactId: string) => Contact;
  getGroupAdmins: (groupId: string) => Contact[];
  getGroupInfoFromInviteLink: (inviteCode: string) => Promise<string | boolean>;
  getGroupInviteLink: (chatId: string) => Promise<string>;
  getGroupParticipantIDs: (groupId: string) => Id[];
  getHost: () => HostDevice;
  getListMute: (type?: string) => object;
  getNewMessageId: (chatId: string) => Object;
  getMessageById: (messageId: string) => Promise<Message>;
  getNumberProfile: (contactId: string) => WhatsappProfile;
  getProfilePicFromServer: (chatId: string) => string;
  getSessionTokenBrowser: (removePath?: boolean) => tokenSession;
  getStatus: (contactId: string) => ContactStatus;
  getTheme: () => string;
  getUnreadMessages: () => any;
  getWAVersion: () => string;
  isConnected: () => boolean;
  isLoggedIn: () => boolean;
  joinGroup: (groupId: string) => Promise<string | boolean>;
  killServiceWorker: () => boolean;
  setPresenceOffline: () => boolean;
  setPresenceOnline: () => boolean;
  leaveGroup: (groupId: string) => any;
  loadAndGetAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
  loadEarlierMessages: (contactId: string) => Message[];
  logout: () => Promise<boolean>;
  markUnseenMessage: (messageId: string) => boolean;
  onAddedToGroup: (callback: Function) => any;
  onIncomingCall: (callback: Function) => any;
  onInterfaceChange: (callback: Function) => void;
  onMessage: (callback: Function) => void;
  onLiveLocation: (chatId: string, callback: Function) => any;
  onParticipantsChanged: (groupId: string, callback: Function) => any;
  onStateChange: (callback: Function) => void;
  openChat: (chatId: string) => boolean;
  openChatAt: (
    chatId: string,
    messageId: string
  ) => { wasVisible: boolean; alignAt: string };
  pinChat: (
    chatId: string,
    option: boolean,
    nonExistent?: boolean
  ) => Promise<object>;
  promoteParticipant: (groupId: string, contactId: string | string[]) => void;
  removeParticipant: (groupId: string, contactId: string | string[]) => void;
  reply: (to: string, content: string, quotedMsg: string) => Promise<object>;
  restartService: () => boolean;
  sendChatstate: (chatState: string, chatId: string) => void;
  sendContactVcard: (
    to: string,
    contact: string,
    name?: string
  ) => Promise<object>;
  sendContactVcardList: (to: string, contacts: string[]) => Promise<object>;
  sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string,
    type?: string,
    status?: boolean
  ) => Promise<SendFileResult>;
  sendImage: (
    imgBase64: string,
    to: string,
    filename: string,
    caption?: string,
    status?: string
  ) => Promise<SendFileResult>;
  sendImageAsSticker: (
    webpBase64: string,
    to: string,
    metadata?: any,
    type?: string
  ) => Promise<SendStickerResult>;
  sendImageAsStickerGif: (
    webpBase64: string,
    to: string,
    metadata?: any
  ) => Promise<SendStickerResult>;
  sendImageWithProduct: (
    base64: string,
    to: string,
    caption: string,
    bizNumber: string,
    productId: string
  ) => any;
  sendLinkPreview: (
    chatId: string,
    url: string,
    title: string
  ) => Promise<SendLinkResult>;
  sendLocation: (
    to: string,
    latitude: string,
    longitude: string,
    title: string
  ) => Promise<object>;
  sendMessage: (
    to: string,
    content: string,
    status?: boolean,
    passId?: Object
  ) => Promise<Object>;
  sendMessageMentioned: (...args: any) => any;
  sendMessageOptions: (
    chat: any,
    content: any,
    options?: any
  ) => Promise<string>;
  sendMessageWithThumb: (
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) => void;
  sendMute: (id: string, time: number, type: string) => Promise<object>;
  sendPtt: (base64: string, to: string) => any;
  sendVideoAsGif: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  setMessagesAdminsOnly: (chatId: string, option: boolean) => boolean;
  setMyName: (name: string) => void;
  setMyStatus: (to: string) => void;
  setProfilePic: (path: string, to?: string) => Promise<boolean>;
  setTheme: (theme?: string) => boolean;
  startTyping: (to: string) => void;
  stopTyping: (to: string) => void;
  takeOver: () => boolean;
  unblockContact: (messageId: string) => boolean;
  waitForStore: (store: string | string[], callback?: Function) => Promise<any>;
  waitNewAcknowledgements: (callback: Function) => void;
  waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  sendSeen: (to: string) => void;
  returnReply: (message: object) => object;
  onStreamChange: (callback: Function) => void;
  onFilePicThumb: (callback: Function) => void;
  onChatState: (callback: Function) => void;
  onUnreadMessage: (callback: Function) => void;
}

declare global {
  interface Window {
    WAPI: WAPI;
  }
  const WAPI: WAPI;
}
