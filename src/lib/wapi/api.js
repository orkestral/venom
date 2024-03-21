import {
  sleep,
  injectConfig,
  injectParasiteSnake,
  processFiles,
  base64ToFile,
  generateMediaKey,
  arrayBufferToBase64,
  encryptAndUploadFile,
  getFileHash
} from './help';

import {
  getChat,
  scope,
  getNewId,
  getNewMessageId,
  sendExist,
  checkNumberStatus,
  isMD,
  sendCheckType,
  addChatWapi
} from './functions/help';

import {
  sendMessage,
  baseSendMessage,
  getAllContacts,
  createGroup,
  createNewsletter,
  addParticipant,
  setGroupDescription,
  getHost,
  setGroupImage
} from './functions';

import {
  serializeMessageObj,
  serializeChatObj,
  serializeContactObj,
  serializeProfilePicThumb,
  serializeRawObj,
  serializeMeObj
} from './serialize';

//initialized scrap webpack
(async () => {
  window.Store = {};
  if (window.__debug) {
    await injectParasiteSnake();
  } else {
    // old webpack
    window[injectConfig.webpack] = window[injectConfig.webpack] || [];

    while (true) {
      try {
        const webPackLast = window[injectConfig.webpack].length - 1;
        if (
          !window[injectConfig.webpack][webPackLast][0].includes(
            injectConfig.parasite
          )
        ) {
          await injectParasiteSnake();
          return;
        }
      } catch {
        await sleep(1000);
      }
    }
  }
})();

if (typeof window.WAPI === 'undefined') {
  window.WAPI = {};

  // Helps
  window.WAPI.getChat = getChat;
  window.WAPI.scope = scope;
  window.WAPI.getNewId = getNewId;
  window.WAPI.getNewMessageId = getNewMessageId;
  window.WAPI.sendExist = sendExist;
  window.WAPI.checkNumberStatus = checkNumberStatus;
  window.WAPI.isMD = isMD;
  window.WAPI.baseSendMessage = baseSendMessage;
  window.WAPI.processFiles = processFiles;
  window.WAPI.base64ToFile = base64ToFile;
  window.WAPI.generateMediaKey = generateMediaKey;
  window.WAPI.arrayBufferToBase64 = arrayBufferToBase64;
  window.WAPI.encryptAndUploadFile = encryptAndUploadFile;
  window.WAPI.getFileHash = getFileHash;
  window.WAPI.sendCheckType = sendCheckType;
  window.WAPI.addChatWapi = addChatWapi;

  // Functions

  // Send
  window.WAPI.sendMessage = sendMessage;

  // Host
  window.WAPI.getAllContacts = getAllContacts;
  window.WAPI.getHost = getHost;

  // Group
  window.WAPI.createGroup = createGroup;
  window.WAPI.addParticipant = addParticipant;
  window.WAPI.setGroupDescription = setGroupDescription;
  window.WAPI.setGroupImage = setGroupImage;

  // Serialize
  window.WAPI.serializeMessageObj = serializeMessageObj;
  window.WAPI.serializeChatObj = serializeChatObj;
  window.WAPI.serializeContactObj = serializeContactObj;
  window.WAPI.serializeProfilePicThumb = serializeProfilePicThumb;
  window.WAPI.serializeRawObj = serializeRawObj;
  window.WAPI.serializeMeObj = serializeMeObj;

  //Newsletter
  window.WAPI.createNewsletter = createNewsletter;
}
