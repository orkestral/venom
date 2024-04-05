import { Id } from './id'

export interface Contact {
  formattedName: string
  id: Id
  isBusiness: boolean
  isEnterprise: boolean
  isHighLevelVerified: any
  isMe: boolean
  isMyContact: boolean
  isPSA: boolean
  isUser: boolean
  isVerified: any
  isWAContact: boolean
  labels: any[]
  msgs: any
  name: string
  plaintextDisabled: boolean
  profilePicThumbObj: {
    eurl: string
    id: Id
    img: string
    imgFull: string
    raw: any
    tag: string
  }
  pushname: string
  sectionHeader: any
  shortName: string
  statusMute: boolean
  type: string
  verifiedLevel: any
  verifiedName: any
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getChatIsOnline} instead.
   */
  isOnline: null | boolean
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getLastSeen} instead.
   */
  lastSeen: null | number | boolean
}
