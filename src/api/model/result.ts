import { LastReceivedKey } from './chat'
import { HostDevice } from './host-device'

export interface ScopeResult {
  me: HostDevice
  to: LastReceivedKey & {
    formattedName: string
    isBusiness: boolean
    isMyContact: boolean
    verifiedName: string
    pushname?: string
    isOnline?: boolean
  }
  erro?: boolean
  text?: string | null
  status?: number | string
}

export interface SendFileResult extends ScopeResult {
  type: string
  filename: string
  text?: string
  mimeType?: string
}

export interface SendStickerResult extends ScopeResult {
  type: string
}

export interface SendLinkResult extends ScopeResult {
  type: string
  url: string
  text: string
}
