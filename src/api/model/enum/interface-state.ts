export enum InterfaceState {
  /**
   * When there are no internet.
   */
  OFFLINE = 'OFFLINE',
  /**
   * When the whatsapp web page is loading.
   */
  OPENING = 'OPENING',
  /**
   * When the whatsapp web is connecting to smartphone after QR code scan.
   */
  PAIRING = 'PAIRING',
  /**
   * When the whatsapp web is syncing messages with smartphone.
   */
  SYNCING = 'SYNCING',
  /**
   * When the whatsapp web is syncing messages with smartphone after a disconnection.
   */
  RESUMING = 'RESUMING',
  /**
   * When the whatsapp web is connecting to whatsapp server.
   */
  CONNECTING = 'CONNECTING',
  /**
   * When the whatsapp web is ready.
   */
  NORMAL = 'NORMAL',
  /**
   * When the whatsapp web couldn't connect to smartphone.
   */
  WITHOUT_INTERNET = 'WITHOUT INTERNET'
}
