import { Id } from './id'
import { GroupChangeEvent } from './enum'

export interface ParticipantEvent {
  by: Id
  action: GroupChangeEvent
  who: [Id]
}
