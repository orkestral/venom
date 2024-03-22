import {
  addParticipant,
  areAllMessagesLoaded,
  asyncLoadAllEarlierMessages,
  blockContact,
  unblockContact,
  getBlockList,
  clearChatMessages,
  createGroup,
  createNewsletter,
  deleteConversation,
  deleteMessages,
  demoteParticipant,
  downloadFile,
  encryptAndUploadFile,
  forwardMessages,
  getAllChatIds,
  getAllChats,
  getAllChatsWithMessages,
  getAllContacts,
  getAllGroupMetadata,
  getAllGroups,
  getAllMessagesInChat,
  getBatteryLevel,
  getChat,
  getChatById,
  getChatByName,
  getCommonGroups,
  getContact,
  getGroupAdmins,
  getGroupInviteLink,
  getGroupParticipant,
  getHost,
  getMe,
  getMessageById,
  getMyContacts,
  getNewId,
  getNewMessageId,
  getNumberProfile,
  getProfilePicFromServer,
  getStatus,
  getUnreadMessages,
  isConnected,
  isLoggedIn,
  leaveGroup,
  loadAllEarlierMessages,
  loadAndGetAllMessagesInChat,
  loadChatEarlierMessages,
  loadEarlierMessagesTillDate,
  processFiles,
  processMessageObj,
  promoteParticipant,
  removeParticipant,
  reply,
  revokeGroupInviteLink,
  sendMessageOptions,
  sendChatstate,
  sendContactVcard,
  sendFile,
  sendPtt,
  sendImage,
  sendImageAsSticker,
  sendImageWithProduct,
  sendLocation,
  sendMessage,
  sendMessage2,
  sendMessageWithTags,
  sendMessageWithThumb,
  sendSticker,
  sendVideoAsGif,
  setMyName,
  setMyStatus,
  startTyping,
  startRecording,
  markPaused,
  clearPresence,
  presenceAvailable,
  presenceUnavailable,
  openChat,
  openChatAt,
  getGroupInfoFromInviteLink,
  joinGroup,
  markUnseenMessage,
  markMarkSeenMessage,
  getTheme,
  setTheme,
  restartService,
  killServiceWorker,
  sendLinkPreview,
  scope,
  getchatId,
  sendExist,
  returnChat,
  sendContactVcardList,
  setProfilePic,
  pinChat,
  getSessionTokenBrowser,
  sendMute,
  getListMute,
  interfaceMute,
  downloadMedia,
  checkIdMessage,
  returnReply,
  logout,
  setPresenceOnline,
  setPresenceOffline,
  archiveChat,
  setNewMessageId,
  setGroupDescription,
  sendButtons,
  setGroupTitle,
  setGroupSettings,
  getAllMessagesDate,
  checkNumberStatus,
  sendCheckType,
  sendListMenu,
  getStateConnection,
  isBeta,
  sendReactions,
  addChatWapi,
  sendTypeButtons,
  onlySendAdmin,
  createCommunity,
  pollCreation
} from './functions';
import {
  base64ToFile,
  generateMediaKey,
  getFileHash,
  arrayBufferToBase64,
  sleep,
  injectConfig
} from './helper';
import {
  addNewMessagesListener,
  addOnAddedToGroup,
  addOnLiveLocation,
  addOnNewAcks,
  addOnPoll,
  addOnParticipantsChange,
  addOnStateChange,
  initNewMessagesListener,
  addOnStreamChange,
  addonFilePicThumb,
  addonUnreadMessage,
  addonChatState,
  addOnStream
} from './listeners';
import {
  _serializeChatObj,
  _serializeContactObj,
  _serializeMessageObj,
  _serializeProfilePicThumb,
  _serializeRawObj,
  _serializeMeObj,
  _serializeForcing
} from './serializers';
import { getStore } from './store/get-store';

window.Store = {};

window.getModuleList = function () {
  let modules = {};
  Object.keys(window.__debug.modulesMap)
    .filter((e) => e.includes('WA'))
    .forEach(function (mod) {
      let module = window.__debug.modulesMap[mod];
      if (module) {
        modules[mod] = {
          default: module.defaultExport,
          factory: module.factory
        };
        if (Object.keys(modules[mod].default).length === 0) {
          try {
            self.ErrorGuard.skipGuardGlobal(true);
            Object.assign(modules[mod], self.importNamespace(mod));
          } catch (e) {}
        }
      }
    });
  return modules;
};

function injectParasite() {
  if (window.__debug) {
    getStore(window.getModuleList()).finally();
  } else {
    if (
      window.webpackChunkwhatsapp_web_client &&
      Array.isArray(window.webpackChunkwhatsapp_web_client)
    ) {
      const parasite = injectConfig.parasite;
      window[injectConfig.webpack].push([
        [parasite],
        {},
        async function (o) {
          let modules = [];
          for (let idx in o.m) {
            modules.push(o(idx));
          }
          await getStore(modules);
        }
      ]);
    }
  }
}

async function waitForObjects() {
  return new Promise((resolve) => {
    const checkObjects = () => {
      if (window.__debug) {
        if (window.__debug.modulesMap?.WAWebUserPrefsMeUser) {
          resolve();
        } else {
          setTimeout(checkObjects, 200);
        }
      } else {
        if (
          window[injectConfig.webpack] &&
          Array.isArray(window[injectConfig.webpack]) &&
          window[injectConfig.webpack].every(
            (item) => Array.isArray(item) && item.length > 0
          )
        ) {
          resolve();
        } else {
          setTimeout(checkObjects, 200);
        }
      }
    };

    checkObjects();
  });
}

(async () => {
  if (window.__debug) {
    await waitForObjects();
    injectParasite();
  } else {
    await waitForObjects();

    const last = window[injectConfig.webpack].length - 1;
    if (
      !window[injectConfig.webpack][last][0].includes(injectConfig.parasite) &&
      document.querySelectorAll('#app .two').length
    ) {
      injectParasite();
    }
  }
})();

if (typeof window.WAPI === 'undefined') {
  window.WAPI = {};

  //Community
  window.WAPI.createCommunity = createCommunity;

  //others
  window.WAPI.interfaceMute = interfaceMute;
  window.WAPI.checkIdMessage = checkIdMessage;
  window.WAPI.returnReply = returnReply;
  window.WAPI.getStore = getStore;
  window.WAPI.setNewMessageId = setNewMessageId;
  window.WAPI.sendButtons = sendButtons;
  window.WAPI.checkNumberStatus = checkNumberStatus;
  window.WAPI.sendCheckType = sendCheckType;
  window.WAPI.sendListMenu = sendListMenu;
  window.WAPI.getStateConnection = getStateConnection;
  window.WAPI.sleep = sleep;
  window.WAPI.isBeta = isBeta;

  //Profile
  window.WAPI.setProfilePic = setProfilePic;
  window.WAPI.getSessionTokenBrowser = getSessionTokenBrowser;

  // Chat Functions
  window.WAPI.scope = scope;
  window.WAPI.getchatId = getchatId;
  window.WAPI.sendExist = sendExist;
  window.WAPI.returnChat = returnChat;
  window.WAPI.pinChat = pinChat;
  window.WAPI.archiveChat = archiveChat;

  // Layout Functions
  window.WAPI.setTheme = setTheme;
  window.WAPI.getTheme = getTheme;

  // Serializers assignations
  window.WAPI._serializeRawObj = _serializeRawObj;
  window.WAPI._serializeChatObj = _serializeChatObj;
  window.WAPI._serializeContactObj = _serializeContactObj;
  window.WAPI._serializeMessageObj = _serializeMessageObj;
  window.WAPI._serializeProfilePicThumb = _serializeProfilePicThumb;
  window.WAPI._serializeMeObj = _serializeMeObj;
  window.WAPI._serializeForcing = _serializeForcing;

  window.WAPI.onlySendAdmin = onlySendAdmin;

  // Group Functions
  window.WAPI.createGroup = createGroup;
  window.WAPI.leaveGroup = leaveGroup;
  window.WAPI.revokeGroupInviteLink = revokeGroupInviteLink;
  window.WAPI.getGroupInviteLink = getGroupInviteLink;
  window.WAPI.getGroupInfoFromInviteLink = getGroupInfoFromInviteLink;
  window.WAPI.getGroupAdmins = getGroupAdmins;
  window.WAPI.removeParticipant = removeParticipant;
  window.WAPI.addParticipant = addParticipant;
  window.WAPI.promoteParticipant = promoteParticipant;
  window.WAPI.demoteParticipant = demoteParticipant;
  window.WAPI.joinGroup = joinGroup;
  window.WAPI.setGroupDescription = setGroupDescription;
  window.WAPI.setPresenceOnline = setPresenceOnline;
  window.WAPI.setPresenceOffline = setPresenceOffline;
  window.WAPI.setGroupTitle = setGroupTitle;
  window.WAPI.setGroupSettings = setGroupSettings;

  //Newsletter functions
  window.WAPI.createNewsletter = createNewsletter;

  // Chatting functions
  window.WAPI.sendChatstate = sendChatstate;
  window.WAPI.sendMessageWithThumb = sendMessageWithThumb;
  window.WAPI.processMessageObj = processMessageObj;
  window.WAPI.sendMessageWithTags = sendMessageWithTags;
  window.WAPI.sendMessage = sendMessage;
  window.WAPI.sendMessage2 = sendMessage2;
  window.WAPI.deleteConversation = deleteConversation;
  window.WAPI.deleteMessages = deleteMessages;
  window.WAPI.clearChatMessages = clearChatMessages;
  window.WAPI.sendImage = sendImage;
  window.WAPI.sendPtt = sendPtt;
  window.WAPI.sendFile = sendFile;
  window.WAPI.setMyName = setMyName;
  window.WAPI.setMyStatus = setMyStatus;
  window.WAPI.sendVideoAsGif = sendVideoAsGif;
  window.WAPI.processFiles = processFiles;
  window.WAPI.sendImageWithProduct = sendImageWithProduct;
  window.WAPI.sendContactVcard = sendContactVcard;
  window.WAPI.sendContactVcardList = sendContactVcardList;
  window.WAPI.forwardMessages = forwardMessages;
  window.WAPI.reply = reply;
  window.WAPI._sendSticker = sendSticker;
  window.WAPI.encryptAndUploadFile = encryptAndUploadFile;
  window.WAPI.sendImageAsSticker = sendImageAsSticker;
  window.WAPI.sendImageAsStickerGif = sendImageAsSticker;
  window.WAPI.startTyping = startTyping;
  window.WAPI.startRecording = startRecording;
  window.WAPI.markPaused = markPaused;
  window.WAPI.clearPresence = clearPresence;
  window.WAPI.presenceAvailable = presenceAvailable;
  window.WAPI.presenceUnavailable = presenceUnavailable;
  window.WAPI.sendLocation = sendLocation;
  window.WAPI.openChat = openChat;
  window.WAPI.openChatAt = openChatAt;
  window.WAPI.markUnseenMessage = markUnseenMessage;
  window.WAPI.markMarkSeenMessage = markMarkSeenMessage;
  window.WAPI.sendLinkPreview = sendLinkPreview;
  window.WAPI.sendMessageOptions = sendMessageOptions;
  window.WAPI.getAllMessagesDate = getAllMessagesDate;
  window.WAPI.sendReactions = sendReactions;
  window.WAPI.addChatWapi = addChatWapi;
  window.WAPI.sendTypeButtons = sendTypeButtons;
  window.WAPI.sendPollCreation = pollCreation;

  //////block functions
  window.WAPI.blockContact = blockContact;
  window.WAPI.unblockContact = unblockContact;
  window.WAPI.getBlockList = getBlockList;

  // Retrieving functions
  window.WAPI.getAllContacts = getAllContacts;
  window.WAPI.getMyContacts = getMyContacts;
  window.WAPI.getContact = getContact;
  window.WAPI.getAllChats = getAllChats;
  window.WAPI.getAllChatIds = getAllChatIds;
  window.WAPI.getAllChatsWithMessages = getAllChatsWithMessages;
  window.WAPI.getAllGroups = getAllGroups;
  window.WAPI.getChat = getChat;
  window.WAPI.getStatus = getStatus;
  window.WAPI.getChatByName = getChatByName;
  window.WAPI.getNewId = getNewId;
  window.WAPI.getChatById = getChatById;
  window.WAPI.loadEarlierMessages = loadChatEarlierMessages;
  window.WAPI.loadAllEarlierMessages = loadAllEarlierMessages;
  window.WAPI.asyncLoadAllEarlierMessages = asyncLoadAllEarlierMessages;
  window.WAPI.areAllMessagesLoaded = areAllMessagesLoaded;
  window.WAPI.loadEarlierMessagesTillDate = loadEarlierMessagesTillDate;
  window.WAPI.getAllGroupMetadata = getAllGroupMetadata;
  window.WAPI.getGroupParticipant = getGroupParticipant;
  window.WAPI.getAllMessagesInChat = getAllMessagesInChat;
  window.WAPI.loadAndGetAllMessagesInChat = loadAndGetAllMessagesInChat;
  window.WAPI.getUnreadMessages = getUnreadMessages;
  window.WAPI.getCommonGroups = getCommonGroups;
  window.WAPI.getProfilePicFromServer = getProfilePicFromServer;
  window.WAPI.downloadFile = downloadFile;
  window.WAPI.downloadMedia = downloadMedia;
  window.WAPI.getNumberProfile = getNumberProfile;
  window.WAPI.getMessageById = getMessageById;
  window.WAPI.getNewMessageId = getNewMessageId;
  window.WAPI.getFileHash = getFileHash;
  window.WAPI.generateMediaKey = generateMediaKey;
  window.WAPI.arrayBufferToBase64 = arrayBufferToBase64;
  window.WAPI.getListMute = getListMute;

  // Device functions
  window.WAPI.getHost = getHost;
  window.WAPI.getMe = getMe;
  window.WAPI.isConnected = isConnected;
  window.WAPI.isLoggedIn = isLoggedIn;
  window.WAPI.getBatteryLevel = getBatteryLevel;
  window.WAPI.base64ImageToFile = base64ToFile;
  window.WAPI.base64ToFile = base64ToFile;
  window.WAPI.restartService = restartService;
  window.WAPI.killServiceWorker = killServiceWorker;
  window.WAPI.sendMute = sendMute;

  // Listeners initialization
  window.WAPI._newMessagesQueue = [];
  window.WAPI._newMessagesBuffer =
    sessionStorage.getItem('saved_msgs') != null
      ? JSON.parse(sessionStorage.getItem('saved_msgs'))
      : [];
  window.WAPI._newMessagesDebouncer = null;
  window.WAPI._newMessagesCallbacks = [];

  // Listeners
  window.addEventListener('unload', window.WAPI._unloadInform, false);
  window.addEventListener('beforeunload', window.WAPI._unloadInform, false);
  window.addEventListener('pageunload', window.WAPI._unloadInform, false);
  // On-work below:

  /**
   * New version of @tag message
   */
  window.WAPI.sendMessageMentioned = async function (
    chatId,
    message,
    mentioned
  ) {
    if (!Array.isArray(mentioned)) {
      mentioned = [mentioned];
    }

    const chat = await WAPI.getChat(chatId);
    const users = await Store.Contact.serialize().filter((x) =>
      mentioned.includes(x.id.user)
    );

    chat.sendMessage(message, {
      linkPreview: null,
      mentionedJidList: users.map((u) => u.id),
      quotedMsg: null,
      quotedMsgAdminGroupJid: null
    });
  };

  window.WAPI.getProfilePicSmallFromId = async function (id) {
    return await window.Store.ProfilePicThumb.find(id).then(
      async function (d) {
        if (d.img !== undefined) {
          return await window.WAPI.downloadFileWithCredentials(d.img);
        } else {
          return false;
        }
      },
      function (e) {
        return false;
      }
    );
  };

  window.WAPI.getProfilePicFromId = async function (id) {
    return await window.Store.ProfilePicThumb.find(id).then(
      async function (d) {
        if (d.imgFull !== undefined) {
          return await window.WAPI.downloadFileWithCredentials(d.imgFull);
        } else {
          return false;
        }
      },
      function (e) {
        return false;
      }
    );
  };

  window.WAPI.downloadFileWithCredentials = async function (url) {
    if (!axios || !url) return false;
    const ab = (
      await axios.get(url, {
        responseType: 'arraybuffer'
      })
    ).data;
    return btoa(
      new Uint8Array(ab).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
  };

  window.WAPI.getChatIsOnline = async function (chatId) {
    const chat = Store.Chat.get(chatId);
    if (!chat) {
      return false;
    }
    await chat.presence.subscribe();
    return chat.presence.attributes.isOnline;
  };

  window.WAPI.getLastSeen = async function (chatId) {
    const chat = Store.Chat.get(chatId);
    if (!chat) {
      return false;
    }
    await chat.presence.subscribe();
    return chat.presence.chatstate.t || false;
  };

  window.WAPI.getWAVersion = function () {
    return window.Debug.VERSION;
  };

  /**
   * @param id The id of the conversation
   * @param archive boolean true => archive, false => unarchive
   * @return boolean true: worked, false: didnt work (probably already in desired state)
   */
  window.WAPI.archiveChat = async function (id, archive) {
    return await Store.Archive.setArchive(Store.Chat.get(id), archive)
      .then((_) => true)
      .catch((_) => false);
  };

  window.WAPI.takeOver = async function () {
    await window.Store.State.Socket.takeover();
    return true;
  };

  /**
   * Registers a callback to be called when your phone receives a new call request.
   * @param callback - function - Callback function to be called upon a new call. returns a call object.
   * @returns {boolean}
   */
  window.WAPI.onIncomingCall = function (callback) {
    window.WAPI.waitForStore(['Call'], () => {
      window.Store.Call.on('add', callback);
    });
    return true;
  };

  window.WAPI.setMessagesAdminsOnly = async function (chatId, option) {
    await Store.WapQuery.setGroupProperty(chatId, 'announcement', option);
    return true;
  };

  window.WAPI.logout = logout;
  window.WAPI.storePromises = {};
  window.WAPI.waitForStore = async function (stores, callback) {
    if (!Array.isArray(stores)) {
      stores = [stores];
    }

    const isUndefined = (p) => typeof window.Store[p] === 'undefined';
    const missing = stores.filter(isUndefined);

    const promises = missing.map((s) => {
      if (!window.WAPI.storePromises[s]) {
        window.WAPI.storePromises[s] = new Promise((resolve) => {
          let time = null;
          const listen = (e) => {
            const name = (e && e.detail) || '';
            if (name === s || !isUndefined(s)) {
              window.removeEventListener('storeLoaded', listen);
              clearInterval(time);
              resolve(true);
            }
          };
          window.addEventListener('storeLoaded', listen);
          time = setInterval(listen, 1000);
        });
      }
      return window.WAPI.storePromises[s];
    });
    const all = Promise.all(promises);

    if (typeof callback === 'function') {
      all.then(callback);
    }

    return await all;
  };

  addOnPoll();

  addNewMessagesListener();

  addonUnreadMessage();
  addonFilePicThumb();
  addonChatState();

  addOnStreamChange();
  addOnStateChange();
  addOnStream();

  initNewMessagesListener();

  addOnNewAcks();
  addOnAddedToGroup();
  addOnLiveLocation();
  addOnParticipantsChange();
}
