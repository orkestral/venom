export interface HostDevice {
  id: string
  ref: string
  refTTL: number
  wid: Me
  connected: boolean
  me: Me
  protoVersion: number[]
  clientToken: string
  serverToken: string
  isResponse: string
  battery: number
  plugged: boolean
  lc: string
  lg: string
  locales: string
  is24h: boolean
  platform: string
  phone: Phone
  tos: number
  smbTos: number
  pushname: string
  blockStoreAdds: boolean
}

export interface Me {
  server: string
  user: string
  _serialized: string
}

export interface Phone {
  wa_version: string
  mcc: string
  mnc: string
  os_version: string
  device_manufacturer: string
  device_model: string
  os_build_number: string
}
