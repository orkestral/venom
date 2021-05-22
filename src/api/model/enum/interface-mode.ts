export enum InterfaceMode {
  /**
   * QR code page.
   */
  QR = 'QR',
  /**
   * Chat page.
   */
  MAIN = 'CONNECTION',
  /**
   * Loading page, waiting data from smartphone.
   */
  SYNCING = 'SYNCING',
  /**
   * Offline page, when there are no internet.
   */
  OFFLINE = 'OFFLINE',
  /**
   * Conflic page, when there are another whatsapp web openned.
   */
  CONFLICT = 'CONFLICT',
  /**
   * Blocked page, by proxy.
   */
  PROXYBLOCK = 'PROXYBLOCK',
  /**
   * Blocked page.
   */
  TOS_BLOCK = 'TOS_BLOCK',
  /**
   * Blocked page.
   */
  SMB_TOS_BLOCK = 'SMB_TOS_BLOCK',
  /**
   * Deprecated page.
   */
  DEPRECATED_VERSION = 'DEPRECATED_VERSION',
}
