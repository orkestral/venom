export enum onMode {
  /**
   * Indicates a change in the user interface.
   * @description Used to receive information about the current interface the user is on.
   */
  interfaceChange = 'interfaceChange',

  /**
   * Monitors new messages.
   * @description Used to receive notifications when a new message is received.
   */
  newMessage = 'newMessage',

  /**
   * Receives QR code updates.
   * @description Used to receive updated information about the QR code.
   */
  qrcode = 'qrcode',

  /**
   * User connection information.
   * @description Used to obtain information about the user's connection.
   */
  connection = 'connection',

  /**
   * Monitors the status of a message.
   * @description Used to receive notifications about the delivery status of a message.
   */
  newOnAck = 'newOnAck',
}
