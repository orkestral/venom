import { AckType } from './enum'
import { LastReceivedKey } from './message'

export interface Revoke {
  id: LastReceivedKey
  ack: AckType
  protocolMessageKey: LastReceivedKey
  viewed: boolean
  type: string
  subtype: string
  t: number
  revokeTimestamp: number
  notifyName: string
  from: string
  to: string
  invis: boolean
  isNewMsg: boolean
  star: boolean
  kicNotified: boolean
  recvFresh: boolean
  isFromTemplate: boolean
  pollInvalidated: boolean
  isSentCagPollCreation: boolean
  isEventCanceled: boolean
  eventInvalidated: boolean
  isVcardOverMmsDocument: boolean
  revokeSender: string
  isForwarded: boolean
  hasReaction: boolean
  isSendFailure: boolean
  errorCode: string
  productHeaderImageRejected: boolean
  lastPlaybackProgress: number
  isDynamicReplyButtonsMsg: boolean
  isCarouselCard: boolean
  isMdHistoryMsg: boolean
  stickerSentTs: number
  isAvatar: boolean
  lastUpdateFromServerTs: number
  botPluginMaybeParent: boolean
  requiresDirectConnection: boolean
  hostedBizEncStateMismatch: boolean
  senderOrRecipientAccountTypeHosted: boolean
  placeholderCreatedWhenAccountIsHosted: boolean
  latestEditMsgKey: any
  latestEditSenderTimestampMs: any
  parentMsgId: any
  invokedBotWid: any
  bizBotType: any
  botResponseTargetId: any
  botPluginType: any
  botPluginReferenceIndex: any
  botPluginSearchProvider: any
  botPluginSearchUrl: any
  botReelPluginThumbnailCdnUrl: any
  botMsgBodyType: any
  bizContentPlaceholderType: any
}
