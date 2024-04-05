export interface PartialMessage {
  id: ID
  body: string
  type: string
  t: number
  notifyName: string
  from: string
  to: string
  self: string
  ack: number
  invis: boolean
  star: boolean
  broadcast: boolean
  mentionedJidList: any[]
  isForwarded: boolean
  labels: any[]
}

interface ID {
  fromMe: boolean
  remote: string
  id: string
  _serialized: string
}
